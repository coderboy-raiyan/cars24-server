import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(path: string) {
    try {
        const result = await cloudinary.uploader.upload(path);
        return {
            secure_url: result?.secure_url,
            public_id: result?.public_id,
        };
    } catch (error) {
        throw new Error(error);
    }
}

export async function deleteFromCloudinary(public_id: string) {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        throw new Error(error);
    }
}
