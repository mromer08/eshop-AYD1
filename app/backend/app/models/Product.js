import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    image_url: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 1 }, // Default stock is 1
    description: { type: String },
    created_at: { type: Date, default: Date.now },
    availability: { type: Boolean, default: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
});

const Product = mongoose.model('Product', productSchema);
export default Product;
