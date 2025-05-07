import Role from '../models/Role.js';

/**
 * Get all roles from the database.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        if (roles.length === 0) {
            return res.status(404).json({ message: 'No roles found' });
        }
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roles', error: error.message });
    }
};

export { getAllRoles };
