import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo_url: { type: String, required: true },
  nit: { type: String, required: true },
  phone_number: { type: String, required: true },
  address: { type: String, required: true }
});

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

export default StoreSettings;
