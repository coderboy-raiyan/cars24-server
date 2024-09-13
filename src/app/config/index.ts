import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({ path: path.join(process.cwd(), '.env') });

export const config = {
    NODE_ENV: process.env.NODE_ENV as 'production' | 'development',
    PORT: process.env.PORT,
    CORS_ORIGIN_URL: process.env.CORS_ORIGIN_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    DEFAULT_PASSWORD: process.env.DEFAULT_PASS,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    RESET_PASS_UI_LINK: process.env.RESET_PASS_UI_LINK,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
};
