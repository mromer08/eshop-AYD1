import User from '../models/User.js';
import Role from '../models/Role.js';
import PermissionType from '../models/PermissionType.js';

const updateUserPermissions = async (req, res) => {
    const { id } = req.params;
    const { permissions } = req.body;
    console.log(req.body);

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const user = await User.findById(id).populate('role').exec();
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }

        if (user.role.code !== 1002) { // Not an Assistant
            return res.status(403).json({ message: 'User does not have the assistant role.' });
        }

        if (!permissions || permissions.length === 0) {
            return res.status(400).json({ message: 'Permissions are required for the assistant role.' });
        }

        for (const permission of permissions) {
            const permissionType = await PermissionType.findById(permission.permissionType).exec();
            if (!permissionType) {
                return res.status(404).json({ message: `PermissionType with ID ${permission.permissionType} not found.` });
            }

            const invalidActions = permission.actions.filter(action => !permissionType.available_actions.includes(action));
            if (invalidActions.length > 0) {
                return res.status(400).json({ 
                    message: `Invalid actions: ${invalidActions.join(', ')} for PermissionType ${permissionType.name}.`
                });
            }
        }

        user.permissions = permissions;

        const updatedUser = await user.save();
        const populatedUser = await User.findById(updatedUser._id)
            .select('-password')
            .populate('role')
            .populate('permissions.permissionType')
            .exec();

        res.json(populatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { updateUserPermissions };
