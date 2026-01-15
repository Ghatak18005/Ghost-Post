import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ""; // Must be 256 bits (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  // Note: If you generated hex, length is 64 characters (32 bytes * 2)
  console.warn("⚠️ WARNING: ENCRYPTION_KEY is missing or invalid length!");
}

export function encrypt(text: string): string {
  if (!text) return "";
  
  // 1. Create a random Initialization Vector (IV)
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // 2. Create Cipher
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  // 3. Encrypt the text
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // 4. Return IV + Encrypted Data (separated by :)
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  if (!text) return "";
  
  try {
    const textParts = text.split(':');
    
    // Check if it's actually encrypted (has 2 parts)
    if (textParts.length < 2) return text; 

    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  } catch (error) {
    console.error("Decryption failed:", error);
    return "[Encrypted Data]"; // Safety fallback
  }
}