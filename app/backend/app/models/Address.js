import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address_line1: { type: String, required: true },
    address_line2: { type: String },
    departamento: { type: String, required: true },
    municipio: { type: String, required: true }
});

const Address = mongoose.model('Address', addressSchema);
export default Address;
