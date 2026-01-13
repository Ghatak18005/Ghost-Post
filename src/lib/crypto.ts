import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// 1. Get the key from .env (Must be 32 characters for AES-256)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012'; 
const ALGORITHM = 'aes-256-cbc';

// 2. Encryption Function
export const encrypt = (text: string) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { 
    iv: iv.toString('hex'), 
    content: encrypted.toString('hex') 
  };
};

// 3. Decryption Function
export const decrypt = (text: string, iv: string) => {
  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), ivBuffer);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};