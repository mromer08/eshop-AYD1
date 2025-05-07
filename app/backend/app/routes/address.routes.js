import express from 'express';
import {
    getAllAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddress
} from '../controllers/addressController.js';

const router = express.Router();

router.get('/', getAllAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.get('/:id', getAddress);

export default router;
