import Category from '../models/Category.js';

/**
 * Get all categories
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories.length) {
            return res.status(204).json({ message: 'No categories found' });
        }
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Create a new category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }

    try {
        // Check for duplicate category name in the database
        const duplicate = await Category.findOne({ name }).exec();
        if (duplicate) return res.sendStatus(409); // Conflict

        // Create and store the new category
        const newCategory = await Category.create({ name });

        console.log(newCategory);
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update a category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateCategory = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const category = await Category.findById(id).exec();
        if (!category) {
            return res.status(404).json({ message: `No category matches ID ${id}.` });
        }

        if (req.body?.name) category.name = req.body.name;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Delete a category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'Category ID required' });

    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: `Category ID ${id} not found` });
        }
        res.status(204).json({ message: `Category ID ${id} deleted`});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get a category by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCategory = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: 'Category ID required' });

    try {
        const category = await Category.findOne({ _id: req.params.id }).exec();
        if (!category) {
            return res.status(404).json({ message: `Category ID ${req.params.id} not found` });
        }
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory
};
