import express from 'express';
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    updatePassword,
    updateAuthenticatedUser,
    getAuthenticatedUser
} from '../controllers/userController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import {updateUserPermissions} from '../controllers/userPermissionController.js'
import verifyPermissions from '../middlewares/verifyPermissions.js';
import verifyRoles from '../middlewares/verifyRoles.js';
import { ADMIN, ASSISTANT } from '../../config/roles.js';

const router = express.Router();

router.get('/profile', getAuthenticatedUser);
router.put('/profile', upload.single('image'), updateAuthenticatedUser);
router.patch('/pwd', updatePassword);
// ONLY ADMIN
router.get('/', verifyRoles(ADMIN), getAllUsers);
router.post('/', verifyRoles(ADMIN), upload.single('image'), createUser);
router.put('/permissions/:id', verifyRoles(ADMIN), updateUserPermissions);
router.put('/:id', verifyRoles(ADMIN), upload.single('image'), updateUser);
router.delete('/:id', verifyRoles(ADMIN), deleteUser);
router.get('/:id', verifyRoles(ADMIN), getUser);

export default router;
