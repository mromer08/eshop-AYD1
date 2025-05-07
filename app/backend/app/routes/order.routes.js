import express from 'express';
import filterOrders, {
    getAllOrders,
    createOrder,
    updateOrderStatus,
    getOrder
} from '../controllers/orderController.js';

import verifyPermissions from '../middlewares/verifyPermissions.js';
import verifyRoles from '../middlewares/verifyRoles.js';
import { ADMIN, ASSISTANT } from '../../config/roles.js';

const router = express.Router();

router.get('/', getAllOrders);
router.post('/', createOrder);
router.get('/filter', filterOrders);
router.put('/:id', verifyRoles(ADMIN, ASSISTANT), verifyPermissions("Pedido", "edit"), updateOrderStatus);
router.get('/:id', getOrder);

export default router;