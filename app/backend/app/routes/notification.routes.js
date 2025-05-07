import express from 'express';
import {
    getAllNotifications,
    createNotification,
    updatedNotification,
    deleteNotification,
    getNotification,
    getNotificationsUser
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', getAllNotifications);
router.post('/', createNotification);
router.put('/:id', updatedNotification);
router.delete('/:id', deleteNotification);
router.get('/:id', getNotification);
router.get('/notificationUser/:idUser', getNotificationsUser);

export default router;