import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    code: { type: Number, unique: true, required: true },
    name: { type: String, unique: true, required: true }
});

const Role = mongoose.model('Role', roleSchema);
export default Role;
