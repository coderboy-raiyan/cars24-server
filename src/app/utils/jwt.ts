import jwt from 'jsonwebtoken';
import { config } from '../config';

export function generateAccessToken<T extends Record<string, unknown>>(payload: T) {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: config.JWT_ACCESS_EXPIRES_IN });
}
export function generateRefreshToken<T extends Record<string, unknown>>(payload: T) {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });
}
