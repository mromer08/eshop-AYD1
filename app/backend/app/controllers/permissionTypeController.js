import PermissionType from '../models/PermissionType.js';

/**
 * Get all permission types from the database.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllPermissionTypes = async (req, res) => {
    try {
        const permissionTypes = await PermissionType.find();
        if (permissionTypes.length === 0) {
            return res.status(404).json({ message: 'No permission types found' });
        }
        res.json(permissionTypes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching permission types', error: error.message });
    }
};

export { getAllPermissionTypes };
