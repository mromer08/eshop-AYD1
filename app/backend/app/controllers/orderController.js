import { ADMIN, ASSISTANT } from '../../config/roles.js';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import CreditCard from '../models/CreditCard.js';
import Address from '../models/Address.js';

/**
 * Get all Orders
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllOrders = async (req, res) => {
    const userId = req.session.user.id;
    const userRole = req.session.user.role;
    try {
        let orders;
        if (userRole === ADMIN || userRole === ASSISTANT) {
            // Admin o assistant: obtén todas las órdenes
            orders = await Order.find()
                .select('-card')
                .populate('user', 'name lastname')
                .populate('delivery_address')
                .populate({
                    path: 'products.product',
                    select: { name: 1, image_url: 1, price: 1 }
                });
        } else {
            // Cliente: obtén solo las órdenes del usuario autenticado
            orders = await Order.find({ user: userId })
                .select('-card')
                .populate('user', 'name lastname')
                .populate('delivery_address')
                .populate({
                    path: 'products.product',
                    select: { name: 1, image_url: 1, price: 1 }
                });
        }

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/**
 * Create a new order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object 
 */
const createOrder = async (req, res) => {
    const userId = req.session.user.id; // El ID del usuario logueado
    const { payment_method, card, delivery_address, shipping_method, products, shipping_cost = 0 } = req.body;

    if (!userId || !products || !shipping_method || !payment_method) {
        return res.status(400).json({
            message: 'User, products, payment method, and shipping method are required.'
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let subtotal = 0; // Inicializar el subtotal

        // Verificar si los productos tienen suficiente stock y calcular el subtotal
        for (const productInfo of products) {
            const product = await Product.findById(productInfo.product).session(session);
            if (!product) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: `Product with ID ${productInfo.product} not found.` });
            }

            if (product.stock < productInfo.quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    message: `Not enough stock for product ${product.name}. Available stock: ${product.stock}`
                });
            }

            // Calcular subtotal
            subtotal += product.price * productInfo.quantity;
        }

        // Verificar que el usuario posee la tarjeta si se paga con tarjeta
        if (payment_method === 'Credit Card') {
            if (!card) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Card is required when payment method is Credit Card.' });
            }

            const userCard = await CreditCard.findOne({ _id: card, user: userId }).session(session);
            if (!userCard) {
                await session.abortTransaction();
                session.endSession();
                return res.status(403).json({ message: 'Unauthorized to use this credit card.' });
            }
        }

        // Verificar que la dirección de entrega sea proporcionada si el envío es a domicilio
        if (shipping_method === 'Home Delivery') {
            if (!delivery_address) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Delivery address is required for Home Delivery.' });
            }

            const userAddress = await Address.findOne({ _id: delivery_address, user: userId }).session(session);
            if (!userAddress) {
                await session.abortTransaction();
                session.endSession();
                return res.status(403).json({ message: 'Unauthorized to use this delivery address.' });
            }
        }

        // Calcular total: subtotal + shipping_cost
        const total = subtotal + shipping_cost;

        // Crear la orden
        const newOrder = new Order({
            user: userId,
            date: new Date(),
            subtotal,  // Subtotal calculado
            total,     // Subtotal + shipping_cost
            shipping_cost, // Costo de envío
            payment_method,
            card,
            delivery_address,
            shipping_method,
            products
        });

        const savedOrder = await newOrder.save({ session });

        // Reducir el stock de cada producto
        for (const productInfo of products) {
            const product = await Product.findById(productInfo.product).session(session);
            product.stock -= productInfo.quantity;
            if(product.stock < 1) product.availability = false;
            await product.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(savedOrder);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
};


/**
 * Update an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Processing', 'Shipped', 'Delivered'].includes(status)) {
        return res.status(400).json({ message: 'Valid status is required: Processing, Shipped, or Delivered.' });
    }

    try {
        const order = await Order.findById(id).exec();
        if (!order) {
            return res.status(404).json({ message: `Order with ID ${id} not found.` });
        }

        // Actualizar el estado y las fechas según corresponda
        order.status = status;

        if (status === 'Shipped' && !order.shipping_date) {
            order.shipping_date = new Date();
        }

        if (status === 'Delivered' && !order.delivery_date) {
            order.delivery_date = new Date();
        }

        const updatedOrder = await order.save();
        res.json( updatedOrder );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get an order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getOrder = async (req, res) => {
    const userId = req.session.user.id;
    const userRole = req.session.user.role;

    if (!req?.params?.id) return res.status(400).json({ message: 'Order ID required' });

    try {

        const order = await Order.findOne({ _id: req.params.id })
            .select('-card')
            .populate('user', 'name lastname')
            .populate('delivery_address')
            .populate({
                path: 'products.product',
                select: { name: 1, image_url: 1, price: 1 }
            }).exec();

        if (!order) {
            return res.status(404).json({ message: `Order ID ${req.params.id} not found` });
        }

        // Verificar si el usuario es el propietario de la orden, un asistente o un administrador
        const isOwner = order.user._id.toString() === userId;
        const isAdminOrAssistant = userRole === ADMIN || userRole === ASSISTANT;

        if (!isOwner && !isAdminOrAssistant) {
            return res.status(403).json({ message: 'You are not authorized to view this order.' });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const filterOrders = async (req, res) => {
    const userId = req.session.user.id;
    const userRole = req.session.user.role;
    const { status, startDate, endDate, startShippingDate, endShippingDate, startDeliveryDate, endDeliveryDate } = req.query;

    try {
        let query = {};

        // Filtro por estado de la orden
        if (status) {
            query.status = status;
        }

        // Filtro por rango de fecha de pedido
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Filtro por rango de fecha de envío
        if (startShippingDate || endShippingDate) {
            query.shipping_date = {};
            if (startShippingDate) query.shipping_date.$gte = new Date(startShippingDate);
            if (endShippingDate) query.shipping_date.$lte = new Date(endShippingDate);
        }

        // Filtro por rango de fecha de entrega
        if (startDeliveryDate || endDeliveryDate) {
            query.delivery_date = {};
            if (startDeliveryDate) query.delivery_date.$gte = new Date(startDeliveryDate);
            if (endDeliveryDate) query.delivery_date.$lte = new Date(endDeliveryDate);
        }

        if (userRole !== ADMIN && userRole !== ASSISTANT) {
            query.user = userId;  // Limitar las órdenes solo al usuario logueado
        }

        // Buscar las órdenes que coincidan con los filtros
        const orders = await Order.find(query)
            .select('-card')
            .populate('user', 'name lastname')
            .populate('delivery_address')
            .populate({
                path: 'products.product',
                select: { name: 1, image_url: 1, price: 1 }
            });

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found with the specified criteria' });
        }

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
};

export default filterOrders;

export {
    getAllOrders,
    createOrder,
    updateOrderStatus,
    getOrder,
    filterOrders
};
