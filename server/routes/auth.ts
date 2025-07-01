import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema, registerSchema, channelProfiles } from '../../db/schema';
import {
  authenticateToken,
  authRateLimiter,
  registerRateLimiter,
  validateBody,
} from '../middleware/auth';
import { db } from '../../db';
import { eq } from 'drizzle-orm';

const router = Router();

/**
 * Register a new user
 * POST /api/auth/register
 */
router.post(
  '/register',
  registerRateLimiter,
  validateBody(registerSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body;

      const { user, tokens } = await AuthService.register({
        email,
        username,
        password,
      });

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
        },
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      console.error('Registration error:', error);

      // Handle specific errors
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message });
      }

      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

/**
 * Login user
 * POST /api/auth/login
 */
router.post(
  '/login',
  authRateLimiter,
  validateBody(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const { user, tokens } = await AuthService.login(email, password);

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          lastLogin: user.lastLogin,
        },
        accessToken: tokens.accessToken,
      });
    } catch (error: any) {
      console.error('Login error:', error);

      // Don't reveal whether email exists
      res.status(401).json({ error: 'Invalid email or password' });
    }
  }
);

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not provided' });
    }

    const tokens = await AuthService.refreshTokens(refreshToken);

    // Update refresh token cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

/**
 * Logout user
 * POST /api/auth/logout
 */
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (req.user) {
      await AuthService.logout(req.user.userId);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

/**
 * Get current user
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await AuthService.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

/**
 * Get user profile with channel information
 * GET /api/auth/profile
 */
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await AuthService.getUserById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get channel profile if exists
    const [profile] = await db
      .select()
      .from(channelProfiles)
      .where(eq(channelProfiles.userId, user.id))
      .limit(1);

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      channelProfile: profile || null
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile information' });
  }
});

/**
 * Change password
 * POST /api/auth/change-password
 */
router.post(
  '/change-password',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ 
          error: 'Old password and new password are required' 
        });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ 
          error: 'New password must be at least 8 characters' 
        });
      }

      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      await AuthService.changePassword(
        req.user.userId,
        oldPassword,
        newPassword
      );

      res.json({ message: 'Password changed successfully' });
    } catch (error: any) {
      console.error('Change password error:', error);

      if (error.message === 'Current password is incorrect') {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Failed to change password' });
    }
  }
);

export default router;