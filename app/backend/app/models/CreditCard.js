import mongoose from 'mongoose';

const creditCardSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    card_number: { type: String, required: true },
    last4Digits: { type: String, required: true }, // Only stores the last 4 digits, not encrypted
    holder_name: { type: String, required: true },
    expiration_date: { type: Date, required: true },
    cvcCode: { type: String, required: true }
});

const CreditCard = mongoose.model('CreditCard', creditCardSchema);
export default CreditCard;
