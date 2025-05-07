import StoreSettings from '../models/StoreSettings.js';
import { uploadImageToS3 } from '../services/awsService.js';

/**
 * Get all store settings
 */
const getStoreSettings = async (req, res) => {
    try {
        const storeSettings = await StoreSettings.findOne();  // Uses findOne to get the single settings document
        if (!storeSettings) {
            return res.status(204).json({ message: 'No store settings found' });
        }
        res.json(storeSettings);  // Directly return the settings object
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * Update store settings
 */
const updateStoreSettings = async (req, res) => {
    const { name, nit, phone_number, address } = req.body;

    try {
        const storeSettings = await StoreSettings.findOne();  // Find the single document
        if (!storeSettings) {
            return res.status(204).json({ message: 'Store settings not found' });
        }

        // Update fields
        storeSettings.name = name ?? storeSettings.name;
        storeSettings.nit = nit ?? storeSettings.nit;
        storeSettings.phone_number = phone_number ?? storeSettings.phone_number;
        storeSettings.address = address ?? storeSettings.address;

        // Check if a new image file is uploaded
        if (req.file) {
            // Upload the new image to S3 and get the URL
            const data = await uploadImageToS3(req.file.buffer, req.file.originalname);
            storeSettings.logo_url = data.Location;  // Update the logo URL with the new S3 URL
        }

        const updatedStoreSettings = await storeSettings.save();
        res.json(updatedStoreSettings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export {
    getStoreSettings,
    updateStoreSettings
};
