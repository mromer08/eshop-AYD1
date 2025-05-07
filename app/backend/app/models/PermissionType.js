import mongoose from 'mongoose';

const permissionTypeSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    available_actions: {
        type: [{ type: String, enum: ['create', 'edit', 'delete', 'view'] }],
        default: ['view']
    }
});

const PermissionType = mongoose.model('PermissionType', permissionTypeSchema);
export default PermissionType;
