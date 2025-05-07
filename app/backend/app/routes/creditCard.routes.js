import express from 'express';
import {
    getAllCreditCards,
    createCreditCard,
    deleteCreditCard,
    getCreditCard,
} from '../controllers/creditCardController.js';

const router = express.Router();

router.get('/', getAllCreditCards);
router.post('/', createCreditCard);
router.delete('/:id', deleteCreditCard);
router.get('/:id', getCreditCard);

export default router;