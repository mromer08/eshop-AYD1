import express from 'express';
import { getAllPermissionTypes } from '../controllers/permissionTypeController.js';

const router = express.Router();

// Ruta para obtener todos los tipos de permisos
router.get('/', getAllPermissionTypes);

export default router;
