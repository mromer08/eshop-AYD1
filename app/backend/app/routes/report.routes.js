import express from 'express';
import { getTopSellingProducts,
        getTopActiveUsers,
        getTopSpendingUsers,
        getOrderCountByField
} from '../controllers/reportController.js';
import verifyRoles from '../middlewares/verifyRoles.js';
import { ADMIN } from '../../config/roles.js';

const router = express.Router();

// Route to get the top 5 best-selling products
router.get('/top-selling-products', verifyRoles(ADMIN), getTopSellingProducts);
router.get('/top-active-users', verifyRoles(ADMIN), getTopActiveUsers);
router.get('/top-spending-users', verifyRoles(ADMIN), getTopSpendingUsers);
router.get('/order-count', verifyRoles(ADMIN), getOrderCountByField);


export default router;
