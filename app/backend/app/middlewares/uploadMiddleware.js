import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp|bmp|svg/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
};

const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // Limitar a 3MB
    fileFilter: fileFilter
});

export { upload };