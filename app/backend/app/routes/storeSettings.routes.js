import express from 'express';
import {
    getStoreSettings,
    updateStoreSettings
} from '../controllers/storeSettingsController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import verifyJWT from '../middlewares/verifyJWT.js';
import verifyPermissions from '../middlewares/verifyPermissions.js';

const router = express.Router();

router.put('/', verifyJWT, verifyPermissions("Configuracion", "edit"), upload.single('image'), updateStoreSettings);
router.get('/', getStoreSettings);

export default router;
