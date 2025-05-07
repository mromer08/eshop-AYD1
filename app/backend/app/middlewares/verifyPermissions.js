import { ADMIN } from '../../config/roles.js'; // Asumo que este valor es el código del rol de administrador
import User from '../models/User.js';

const verifyPermissions = (requiredPermissionType, requiredAction) => {
    return async (req, res, next) => {
        try {
            // Obtener el ID del usuario autenticado desde la sesión
            const userId = req.session.user.id;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Buscar al usuario por ID, incluyendo los permisos
            const user = await User.findById(userId)
                .populate('role') // Aseguramos que también traemos el rol del usuario
                .populate('permissions.permissionType')
                .exec();

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Si el usuario es administrador, omitir la verificación de permisos
            if (user.role.code === ADMIN) {
                return next();
            }

            // Verificar si el usuario tiene el permiso y acción requeridos
            const permission = user.permissions.find(perm => 
                perm.permissionType.name === requiredPermissionType && 
                perm.actions.includes(requiredAction)
            );

            if (!permission) {
                return res.status(403).json({ 
                    message: `User does not have the required permission: ${requiredPermissionType} with action: ${requiredAction}` 
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    };
};

export default verifyPermissions;
