import User from '../models/User.js';
import Role from '../models/Role.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { uploadImageToS3 } from '../services/awsService.js';
import mongoose from 'mongoose';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
    const { name, lastname, email, phone_number, nit, password } = req.body;

    if (!name || !lastname || !email || !password) {
        return res.status(400).json({ message: 'Name, lastname, email, and password are required.' });
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

        // Find the CUSTOMER role (with code 2000)
        const customerRole = await Role.findOne({ code: 2000 });
        if (!customerRole) {
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({ message: 'Default role CUSTOMER not found' });
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
            role: customerRole._id  // Assign the CUSTOMER role by default
        });

        const savedUser = await newUser.save({ session });

        // Create JWT token
        const dataToken = {
            id: savedUser._id,
            role: customerRole.code
        };

        const token = jwt.sign(dataToken, process.env.SECRET_KEY, { expiresIn: '1d' });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: `New user ${email} created!`, token });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: err.message });
    }
};

/**
 * Login an existing user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).populate('role');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const dataToken = {
            id: user._id,
            role: user.role.code
        };

        const token = jwt.sign(dataToken, process.env.SECRET_KEY, { expiresIn: '1d' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { register, login };
