import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    shipping_date: { type: Date },
    delivery_date: { type: Date },
    total: { type: Number, required: true },
    subtotal: { type: Number },
    payment_method: { type: String, enum: ['Cash', 'Credit Card'], required: true, default: 'Cash' },
    card: { type: mongoose.Schema.Types.ObjectId, ref: 'CreditCard' },
    delivery_address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
    shipping_method: { type: String, enum: ['Home Delivery', 'Store Pickup'], required: true, default: 'Store Pickup' },
    shipping_cost: { type: Number, default: 0 },
    status: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }]
});

const Order = mongoose.model('Order', orderSchema);
export default Order;