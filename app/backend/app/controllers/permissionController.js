import Permission from '../models/Permission.js';

/**
 * Get all permissions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find();
        if (!permissions.length) {
            return res.status(404).json({ message: 'No permissions found' });
        }
        res.json(permissions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get a permission by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPermission = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Permission ID required' });
    }

    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) {
            return res.status(404).json({ message: `No permission found with ID ${req.params.id}` });
        }
        res.json(permission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Create a new permission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPermission = async (req, res) => {
    const { resource_name } = req.body;

    if (!resource_name) {
        return res.status(400).json({ message: 'Resource name is required.' });
    }

    try {
        const newPermission = await Permission.create({ resource_name });
        res.status(201).json(newPermission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update a permission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatePermission = async (req, res) => {
    const { id } = req.params;
    const { resource_name } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const permission = await Permission.findById(id);
        if (!permission) {
            return res.status(404).json({ message: `No permission found with ID ${id}.` });
        }

        if (resource_name) permission.resource_name = resource_name;

        const updatedPermission = await permission.save();
        res.json(updatedPermission);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Delete a permission
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deletePermission = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Permission ID required' });
    }

    try {
        const permission = await Permission.findByIdAndDelete(id);
        if (!permission) {
            return res.status(404).json({ message: `Permission ID ${id} not found` });
        }
        res.status(204).json({ message: `Permission ID ${id} deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getAllPermissions,
    getPermission,
    createPermission,
    updatePermission,
    deletePermission
};

