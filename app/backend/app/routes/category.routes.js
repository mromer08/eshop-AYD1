import express from 'express';
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory
} from '../controllers/categoryController.js';
import verifyPermissions from '../middlewares/verifyPermissions.js';
import verifyRoles from '../middlewares/verifyRoles.js';
import { ADMIN, ASSISTANT } from '../../config/roles.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

router.get('/', getAllCategories);
router.post('/', verifyJWT, verifyRoles(ADMIN, ASSISTANT), verifyPermissions("Categoria", "create"), createCategory);
router.put('/:id', verifyJWT, verifyRoles(ADMIN, ASSISTANT), verifyPermissions("Categoria", "edit"), updateCategory);
router.delete('/:id', verifyJWT, verifyRoles(ADMIN, ASSISTANT), verifyPermissions("Categoria", "delete"), deleteCategory);
router.get('/:id', getCategory);

export default router;
