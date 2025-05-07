import { ADMIN, ASSISTANT } from '../../config/roles.js';
import Address from '../models/Address.js';

/**
 * Get all addresses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllAddresses = async (req, res) => {
    const userId = req.session.user.id;
    const userRole = req.session.user.role; // Getting role from session

    try {
        let addresses;

        // Check if the user's role is admin
        if (userRole === ADMIN || userRole === ASSISTANT) {
            addresses = await Address.find().populate('user', 'name lastname');
        } else {
            // Get addresses only for the logged-in user
            addresses = await Address.find({ user: userId }).populate('user', 'name lastname');
        }

        if (!addresses.length) {
            return res.status(404).json({ message: 'No addresses found' });
        }

        res.json(addresses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Create a new address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createAddress = async (req, res) => {
    const user = req.session.user.id;
    const { address_line1, address_line2, departamento, municipio } = req.body;
    if (!user || !address_line1 || !departamento || !municipio) {
        return res.status(400).json({ message: 'User, address line 1, departamento, and municipio are required.' });
    }

    try {
        const newAddress = await Address.create({
            user,
            address_line1,
            address_line2,
            departamento,
            municipio
        });

        console.log(newAddress);
        res.status(201).json(newAddress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update an address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateAddress = async (req, res) => {
    const { id } = req.params;
    const loggedInUserId = req.session.user.id; // Get the logged-in user ID

    if (!id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const address = await Address.findById(id).exec();
        if (!address) {
            return res.status(404).json({ message: `No address matches ID ${id}.` });
        }

        // Check if the logged-in user owns the address
        if (address.user.toString() !== loggedInUserId) {
            return res.status(403).json({ message: 'You do not have permission to update this address.' });
        }

        // Update the address fields if they are provided
        if (req.body?.address_line1) address.address_line1 = req.body.address_line1;
        if (req.body?.address_line2) address.address_line2 = req.body.address_line2;
        if (req.body?.departamento) address.departamento = req.body.departamento;
        if (req.body?.municipio) address.municipio = req.body.municipio;

        const updatedAddress = await address.save();
        res.json(updatedAddress);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Delete an address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteAddress = async (req, res) => {
    const { id } = req.params;
    const loggedInUserId = req.session.user.id; // Get the logged-in user ID

    if (!id) return res.status(400).json({ message: 'Address ID required' });

    try {
        const address = await Address.findById(id).exec();
        if (!address) {
            return res.status(404).json({ message: `Address ID ${id} not found` });
        }

        // Check if the logged-in user owns the address
        if (address.user.toString() !== loggedInUserId) {
            return res.status(403).json({ message: 'You do not have permission to delete this address.' });
        }

        // Delete the address
        await Address.deleteOne({_id: address._id});

        res.status(204).json({ message: `Address ID ${id} deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


/**
 * Get an address by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAddress = async (req, res) => {
    const loggedInUserId = req.session.user.id; // Get the logged-in user ID
    const loggedInUserRole = req.session.user.role; // Get the logged-in user role

    if (!req?.params?.id) return res.status(400).json({ message: 'Address ID required' });

    try {
        const address = await Address.findOne({ _id: req.params.id }).populate('user', 'name lastname').exec();
        if (!address) {
            return res.status(404).json({ message: `Address ID ${req.params.id} not found` });
        }

        // Allow if the user is an admin (role code 1001), an assistant (role code 1002), or the owner of the address
        if (loggedInUserRole === ADMIN || loggedInUserRole === ASSISTANT || address.user._id.toString() === loggedInUserId) {
            return res.json(address);
        } else {
            return res.status(403).json({ message: 'You do not have permission to access this address.' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getAllAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddress
};
