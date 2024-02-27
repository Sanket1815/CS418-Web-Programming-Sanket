import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export interface TokenPayload {
  id: string;
  email: string;
  password: string;
}
const secretKey = process.env.SECRET_KEY;
console.log('secret', secretKey);

export async function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, secretKey, { expiresIn: '1hr' });
}

export async function verifyToken(token: string) {
  const decodedToken = jwt.verify(
    token,
    process.env.SECRET_KEY,
  ) as TokenPayload;
  const email = decodedToken.email;
  return email;
}
