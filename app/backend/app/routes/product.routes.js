import express from 'express';
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    searchProducts
} from '../controllers/productController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import verifyPermissions from '../middlewares/verifyPermissions.js';
import verifyRoles from '../middlewares/verifyRoles.js';
import { ADMIN, ASSISTANT } from '../../config/roles.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.post('/', verifyJWT, verifyRoles(ADMIN, ASSISTANT), verifyPermissions('Producto', 'create'), upload.single('image'), createProduct);
router.put('/:id', verifyJWT, verifyRoles(ADMIN, ASSISTANT), verifyPermissions('Producto', 'edit'), upload.single('image'), updateProduct);
router.delete('/:id', verifyJWT, verifyRoles(ADMIN, ASSISTANT), verifyPermissions('Producto', 'delete'), deleteProduct);
router.get('/:id', getProduct);

export default router;
