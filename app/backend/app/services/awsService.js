import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import crypto from 'crypto';
import path from 'path';

dotenv.config();

// Configurar AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const uploadImageToS3 = async (buffer, originalName) => {
    const base64Image = buffer.toString('base64');
    
    // Extraer la extensión del archivo original
    const fileExtension = path.extname(originalName);
    
    // Generar nombre de archivo usando crypto y la extensión extraída
    const fileName = `${generateFileName()}${fileExtension}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(base64Image, 'base64'),
        ContentEncoding: 'base64',
        ContentType: `image/${fileExtension.slice(1)}` // Ajusta el ContentType según la extensión
    };

    return s3.upload(params).promise();
};

export { uploadImageToS3 };
