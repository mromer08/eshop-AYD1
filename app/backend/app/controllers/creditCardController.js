import bcrypt from 'bcrypt';
import CreditCard from '../models/CreditCard.js';

// Helper function to encrypt card details
const encryptCardData = async (data) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
};

/**
 * Get all credit cards of the authenticated user
 */
const getAllCreditCards = async (req, res) => {
    const userId = req.session.user.id; // Assuming session has user info

    try {
        const cards = await CreditCard.find({ user: userId }).select('-cvcCode -card_number').populate('user', 'name lastname');
        if (!cards.length) {
            return res.status(404).json({ message: 'No credit cards found' });
        }
        res.json(cards);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Create a new Credit Card
 */
const createCreditCard = async (req, res) => {
    const user = req.session.user.id;
    const { card_number, holder_name, expiration_date, cvcCode } = req.body;

    if (!card_number || !holder_name || !expiration_date || !cvcCode) {
        return res.status(400).json({ message: 'Card Number, Holder Name, Expiration Date, and CVC Code are required.' });
    }

    try {
        const last4Digits = card_number.slice(-4);  // Extract the last 4 digits
        const encryptedCardNumber = await encryptCardData(card_number);
        const encryptedCvcCode = await encryptCardData(cvcCode);

        const newCreditCard = await CreditCard.create({
            user,
            card_number: encryptedCardNumber,
            last4Digits,
            holder_name,
            expiration_date,
            cvcCode: encryptedCvcCode,
        });
        await newCreditCard.save();
        const creditCardResponse = newCreditCard.toObject();
        delete creditCardResponse.card_number;
        delete creditCardResponse.cvcCode;

        res.status(201).json(creditCardResponse);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Delete a Credit Card
 */
const deleteCreditCard = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.id;

    if (!id) return res.status(400).json({ message: 'Credit Card ID required' });

    try {
        const card = await CreditCard.findById(id).exec();
        if (!card) {
            return res.status(404).json({ message: `Credit Card with ID ${id} not found` });
        }

        if (card.user.toString() !== userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this card' });
        }

        await CreditCard.deleteOne({_id:card._id});
        res.status(204).json({ message: `Credit Card ID ${id} deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Get a Credit Card by ID for the authenticated user
 */
const getCreditCard = async (req, res) => {
    const { id } = req.params;
    const userId = req.session.user.id;

    if (!id) return res.status(400).json({ message: 'Credit Card ID required' });

    try {
        const card = await CreditCard.findById(id).select('-cvcCode -card_number').exec();
        if (!card) {
            return res.status(404).json({ message: `Credit Card ID ${id} not found` });
        }

        if (card.user.toString() !== userId) {
            return res.status(403).json({ message: 'You do not have permission to view this card' });
        }

        res.json(card);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getAllCreditCards,
    createCreditCard,
    deleteCreditCard,
    getCreditCard,
};
