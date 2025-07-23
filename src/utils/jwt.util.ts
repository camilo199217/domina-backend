import jwt from 'jsonwebtoken';
import { JwtPayload } from 'src/types/JwtPayload';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
