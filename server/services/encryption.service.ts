import crypto from 'crypto';

// Use environment variable or generate a default key (should be in .env for production)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex').slice(0, 32);
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

export class EncryptionService {
  /**
   * Encrypt a string
   */
  static encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  /**
   * Decrypt a string
   */
  static decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
    
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString();
  }

  /**
   * Hash a string (one-way, for comparison)
   */
  static hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}