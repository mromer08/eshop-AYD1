import User from '../models/User.js';
import Role from '../models/Role.js';
import PermissionType from '../models/PermissionType.js';
import { uploadImageToS3 } from '../services/awsService.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('role').populate('permissions.permissionType').exec();
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createUser = async (req, res) => {
    const { name, lastname, email, phone_number, nit, password, role, permissions } = req.body;

    if (!name || !lastname || !email || !password || !role) {
        return res.status(400).json({ message: 'Name, lastname, email, password, and role are required.' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Check for duplicate email in the database
        const duplicate = await User.findOne({ email }).exec();
        if (duplicate) {
            await session.abortTransaction();
            session.endSession();
            return res.sendStatus(409); // Conflict
        }

        // Encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        let imageUrl;
        if (req.file) {
            // Upload the image to S3
            const data = await uploadImageToS3(req.file.buffer, req.file.originalname);
            imageUrl = data.Location;
        }

        // Verify if the role requires permissions (e.g., ayudante role)
        const roleData = await Role.findById(role).exec();
        if (!roleData) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Role not found' });
        }

        if (roleData.code === 1002) { // Assistant role
            if (!permissions || permissions.length === 0) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: 'Permissions are required for the assistant role.' });
            }

            for (const permission of permissions) {
                const permissionType = await PermissionType.findById(permission.permissionType).exec();
                if (!permissionType) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(404).json({ message: `PermissionType with ID ${permission.permissionType} not found.` });
                }

                const invalidActions = permission.actions.filter(action => !permissionType.available_actions.includes(action));
                if (invalidActions.length > 0) {
                    await session.abortTransaction();
                    session.endSession();
                    return res.status(400).json({ 
                        message: `Invalid actions: ${invalidActions.join(', ')} for PermissionType ${permissionType.name}.`
                    });
                }
            }
        }

        // Create and store the new user
        const newUser = new User({
            name,
            lastname,
            email,
            phone_number,
            nit,
            image_url: imageUrl, // Only set this if an image is uploaded
            password: hashedPwd,
            role,
            permissions: roleData.code === 1002 ? permissions : []
        });

        const savedUser = await newUser.save({ session });

        await session.commitTransaction();
        session.endSession();

        const userObject = savedUser.toObject();
        delete userObject.password;

        res.status(201).json(userObject);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update an existing user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, lastname, phone_number, nit } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const user = await User.findById(id).select('-password').exec();
        if (!user) {
            return res.status(404).json({ message: `No user found with ID ${id}.` });
        }

        if (name) user.name = name;
        if (lastname) user.lastname = lastname;
        if (phone_number) user.phone_number = phone_number;
        if (nit) user.nit = nit;

        if (req.file) {
            // Upload the image to S3 if a new image is provided
            const data = await uploadImageToS3(req.file.buffer, req.file.originalname);
            user.image_url = data.Location;
        }

        const updatedUser = await user.save();

        // const userObject = updatedUser.toObject();
        // delete userObject.password;
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: `User ID ${id} not found` });
        }
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/**
 * Get a user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password').populate('role').populate('permissions.permissionType').exec();
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

const updatePassword = async (req, res) => {
    const id = req.session.user.id;
    const { current_password, new_password } = req.body;

    if (!id || !current_password || !new_password) {
        return res.status(400).json({ message: 'ID, current password, and new password are required.' });
    }

    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({ message: `User with ID ${id} not found` });
        }

        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10);
        user.password = hashedNewPassword;

        await user.save();
        res.json({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAuthenticatedUser = async (req, res) => {
    const userId = req.session.user.id;  // Obtener el ID del usuario autenticado desde la sesión
    const { name, lastname, phone_number, nit } = req.body;

    try {
        const user = await User.findById(userId).select('-password').exec();
        if (!user) {
            return res.status(404).json({ message: `No user found with ID ${userId}.` });
        }

        if (name) user.name = name;
        if (lastname) user.lastname = lastname;
        if (phone_number) user.phone_number = phone_number;
        if (nit) user.nit = nit;

        if (req.file) {
            // Upload the image to S3 if a new image is provided
            const data = await uploadImageToS3(req.file.buffer, req.file.originalname);
            user.image_url = data.Location;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAuthenticatedUser = async (req, res) => {
    const userId = req.session.user.id;  // Obtener el ID del usuario autenticado desde la sesión

    try {
        const user = await User.findById(userId)
            .select('-password')
            .populate('role')
            .populate('permissions.permissionType')
            .exec();

        if (!user) {
            return res.status(404).json({ message: `User with ID ${userId} not found` });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};


export {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    updatePassword,
    updateAuthenticatedUser,
    getAuthenticatedUser
};
