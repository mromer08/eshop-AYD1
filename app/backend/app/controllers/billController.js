import Order from '../models/Order.js';

/**
 * Get an order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getOrderDetails(orderId) {
    return await Order.findById(orderId)
        .populate('user')
        .populate('products.product') // Populate para obtener los detalles del producto
        .exec();
}
export {
    getOrderDetails
};