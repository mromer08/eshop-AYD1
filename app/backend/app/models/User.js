import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    image_url: { type: String },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    phone_number: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    nit: { type: String, default: 'CF' },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    permissions: [{
        permissionType: { type: mongoose.Schema.Types.ObjectId, ref: 'PermissionType', required: true },
        actions: [{ 
            type: String, 
            enum: ['create', 'edit', 'delete', 'view']
        }]
    }]
});

const User = mongoose.model('User', userSchema);
export default User;
