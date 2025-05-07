import Product from '../models/Product.js';
import { uploadImageToS3 } from '../services/awsService.js';
import mongoose from 'mongoose';
import Category from '../models/Category.js';

/**
 * Get all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('categories');
        if (!products.length) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Create a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createProduct = async (req, res) => {
    const { name, price, stock, description, status, categories } = req.body;

    if (!name || !price) {
        return res.status(400).json({ message: 'Product name and price are required.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let imageUrl;

        if (req.file) {
            // Subir la imagen a S3
            const data = await uploadImageToS3(req.file.buffer, req.file.originalname);
            imageUrl = data.Location;
        }

        // Crear y guardar el nuevo producto
        const newProduct = new Product({
            image_url: imageUrl,
            name,
            price,
            stock,
            description,
            status,
            categories
        });

        const savedProduct = await newProduct.save({ session });

        await session.commitTransaction();
        session.endSession();

        console.log(savedProduct);
        res.status(201).json(savedProduct);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateProduct = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const product = await Product.findById(id).exec();
        if (!product) {
            return res.status(404).json({ message: `No product matches ID ${id}.` });
        }

        // Check if a new image file is uploaded
        if (req.file) {
            // Upload the new image to S3 and get the URL
            const data = await uploadImageToS3(req.file.buffer, req.file.originalname);
            product.image_url = data.Location;  // Update the image URL with the new S3 URL
        } else if (req.body.image_url) {
            // Optionally update image URL directly if provided (and no file upload)
            product.image_url = req.body.image_url;
        }

        product.name = req.body.name ?? product.name;
        product.price = req.body.price ?? product.price;
        product.stock = req.body.stock ?? product.stock;
        product.description = req.body.description ?? product.description;
        product.status = req.body.status ?? product.status;
        product.categories = req.body.categories ?? product.categories;

        const updatedProduct = await product.save();
        console.log(updatedProduct);
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Delete a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    if (!productId) return res.status(400).json({ message: 'Product ID required' });

    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: `Product ID ${productId} not found` });
        }
        res.status(204).json({ message: `Product ID ${productId} deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/**
 * Get a product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProduct = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: 'Product ID required' });

    try {
        const product = await Product.findOne({ _id: req.params.id }).populate('categories').exec();
        if (!product) {
            return res.status(404).json({ message: `Product ID ${req.params.id} not found` });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const searchProducts = async (req, res) => {
    try {
        let query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }

        if (req.query.minPrice) {
            query.price = { $gte: Number(req.query.minPrice) };
        }

        if (req.query.maxPrice) {
            if (query.price) {
                query.price.$lte = Number(req.query.maxPrice);
            } else {
                query.price = { $lte: Number(req.query.maxPrice) };
            }
        }

        if (req.query.categories) {
            const categoryNames = Array.isArray(req.query.categories) ? req.query.categories : [req.query.categories];
            const categoryRegexes = categoryNames.map(name => new RegExp(name, 'i'));
            const categories = await Category.find({ name: { $in: categoryRegexes } }).select('_id');
        
            if (categories.length > 0) {
                const categoryIds = categories.map(category => category._id);
                query.categories = { $in: categoryIds };
            } else {
                return res.status(404).json({ message: 'No categories found with the provided names' });
            }
        }

        const products = await Product.find(query)
            .populate('categories')
            .exec();

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

export {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    searchProducts
};
