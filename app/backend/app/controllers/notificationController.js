import Notification from '../models/Notification.js';

/**
 * Get all notifications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllNotifications = async(req, res) => {
    try {
        const notifications = await Notification.find().populate('user');
        if (!notifications.length) {
            return res.status(404).json({ message: 'No notifications found' });
        }
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Create a new notification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createNotification = async(req, res) => {
    const { user, title, description } = req.body;
    if (!user || !title || !description) {
        return res.status(400).json({ message: 'User, title and description are required.' });
    }

    try {
        const newNotification = await Notification.create({ user, title, description });

        console.log(newNotification);
        res.status(201).json({ success: 'New notification created!', notification: newNotification });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update a notification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updatedNotification = async(req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const notification = await Notification.findById(id).exec();
        if (!notification) {
            return res.status(404).json({ message: `No notification matches ID ${id}.` });
        }

        if (req.body ?.user) notification.user = req.body.user;
        if (req.body ?.title) notification.title = req.body.title;
        if (req.body ?.description) notification.description = req.body.description;

        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Delete a notification
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteNotification = async(req, res) => {
    try {
        const { id } = req.params;
        const deletedNotification = await Notification.findByIdAndDelete(id);

        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully', deletedNotification });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


/**
 * Get a notification by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getNotification = async(req, res) => {
    if (!req ?.params ?.id) return res.status(400).json({ message: 'Notification ID required' });

    try {
        const notification = await Notification.findOne({ _id: req.params.id }).populate('user').exec();
        if (!notification) {
            return res.status(404).json({ message: `Notification ID ${req.params.id} not found` });
        }
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getNotificationsUser = async(req, res) => {

    if (!req ?.params ?.idUser) return res.status(400).json({ message: 'User ID required' });

    try {
        const notification = await Notification.find({ user: req.params.idUser }).populate('user').exec();
        if (!notification) {
            return res.status(204).json({ message: `User does not have any Notification yet` });
        }
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

};

export {
    getAllNotifications,
    createNotification,
    updatedNotification,
    deleteNotification,
    getNotification,
    getNotificationsUser
};
