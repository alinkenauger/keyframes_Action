import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../../db';
import { users, type InsertUser, type SelectUser } from '../../db/schema';
import { eq } from 'drizzle-orm';

// Configuration
const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Get secrets from environment
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
};

const getRefreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh';
  return secret;
};

// Types
export interface TokenPayload {
  userId: number;
  email: string;
  username: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Hash a password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a password against a hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT tokens
   */
  static generateTokens(user: SelectUser): AuthTokens {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = jwt.sign(payload, getJWTSecret(), {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, getRefreshSecret(), {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, getJWTSecret()) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, getRefreshSecret()) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Register a new user
   */
  static async register(userData: {
    email: string;
    username: string;
    password: string;
  }): Promise<{ user: SelectUser; tokens: AuthTokens }> {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Check if username is taken
    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(users.username, userData.username))
      .limit(1);

    if (existingUsername.length > 0) {
      throw new Error('Username is already taken');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
      })
      .returning();

    // Generate tokens
    const tokens = this.generateTokens(newUser);

    // Store refresh token
    await db
      .update(users)
      .set({ refreshToken: tokens.refreshToken })
      .where(eq(users.id, newUser.id));

    return { user: newUser, tokens };
  }

  /**
   * Login user
   */
  static async login(
    email: string,
    password: string
  ): Promise<{ user: SelectUser; tokens: AuthTokens }> {
    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isValid = await this.verifyPassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens(user);

    // Update user with refresh token and last login
    await db
      .update(users)
      .set({
        refreshToken: tokens.refreshToken,
        lastLogin: new Date(),
      })
      .where(eq(users.id, user.id));

    return { user, tokens };
  }

  /**
   * Refresh tokens
   */
  static async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // Verify refresh token
    const payload = this.verifyRefreshToken(refreshToken);

    // Find user and verify refresh token matches
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user || user.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Generate new tokens
    const tokens = this.generateTokens(user);

    // Update refresh token
    await db
      .update(users)
      .set({ refreshToken: tokens.refreshToken })
      .where(eq(users.id, user.id));

    return tokens;
  }

  /**
   * Logout user
   */
  static async logout(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ refreshToken: null })
      .where(eq(users.id, userId));
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: number): Promise<SelectUser | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user || null;
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    // Verify old password
    const isValid = await this.verifyPassword(oldPassword, user.password);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  }
}