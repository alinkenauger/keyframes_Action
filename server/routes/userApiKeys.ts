import { Router, Request, Response } from 'express';
import { db } from '../../db/index.js';
import { userApiKeys } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { authenticateToken } from '../middleware/auth.js';
import { EncryptionService } from '../services/encryption.service.js';
import OpenAI from 'openai';
import { z } from 'zod';

// Extend Request to include user
interface AuthRequest extends Request {
  user?: {
    id?: number;
    userId?: number;
    email: string;
    username: string;
  };
}

const router = Router();

// Validation schemas
const createApiKeySchema = z.object({
  provider: z.enum(['openai', 'anthropic']).default('openai'),
  apiKey: z.string().min(20, 'API key seems too short').max(200, 'API key seems too long')
});

const validateApiKeySchema = z.object({
  provider: z.enum(['openai', 'anthropic']).default('openai'),
  apiKey: z.string()
});

// Apply authentication to all routes
router.use(authenticateToken);

// GET /user/api-keys - Get all user's API keys
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const keys = await db
      .select({
        id: userApiKeys.id,
        provider: userApiKeys.provider,
        isActive: userApiKeys.isActive,
        lastUsed: userApiKeys.lastUsed,
        createdAt: userApiKeys.createdAt,
        updatedAt: userApiKeys.updatedAt
      })
      .from(userApiKeys)
      .where(eq(userApiKeys.userId, userId));

    res.json({ 
      success: true,
      apiKeys: keys 
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Failed to fetch API keys' });
  }
});

// POST /user/api-keys - Save/update user's API key
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate request body
    const validation = createApiKeySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validation.error.errors 
      });
    }

    const { provider, apiKey } = validation.data;

    // Encrypt the API key
    const encryptedApiKey = EncryptionService.encrypt(apiKey);

    // Check if user already has a key for this provider
    const existingKey = await db
      .select()
      .from(userApiKeys)
      .where(
        and(
          eq(userApiKeys.userId, userId),
          eq(userApiKeys.provider, provider)
        )
      )
      .limit(1);

    if (existingKey.length > 0) {
      // Update existing key
      const [updatedKey] = await db
        .update(userApiKeys)
        .set({
          apiKey: encryptedApiKey,
          isActive: true,
          updatedAt: new Date()
        })
        .where(eq(userApiKeys.id, existingKey[0].id))
        .returning({
          id: userApiKeys.id,
          provider: userApiKeys.provider,
          isActive: userApiKeys.isActive,
          updatedAt: userApiKeys.updatedAt
        });

      res.json({
        success: true,
        message: 'API key updated successfully',
        apiKey: updatedKey
      });
    } else {
      // Create new key
      const [newKey] = await db
        .insert(userApiKeys)
        .values({
          userId,
          provider,
          apiKey: encryptedApiKey,
          isActive: true
        })
        .returning({
          id: userApiKeys.id,
          provider: userApiKeys.provider,
          isActive: userApiKeys.isActive,
          createdAt: userApiKeys.createdAt
        });

      res.json({
        success: true,
        message: 'API key saved successfully',
        apiKey: newKey
      });
    }
  } catch (error) {
    console.error('Error saving API key:', error);
    res.status(500).json({ error: 'Failed to save API key' });
  }
});

// DELETE /user/api-keys/:id - Delete a specific API key
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const keyId = parseInt(req.params.id);
    if (isNaN(keyId)) {
      return res.status(400).json({ error: 'Invalid key ID' });
    }

    // Verify ownership before deleting
    const key = await db
      .select()
      .from(userApiKeys)
      .where(
        and(
          eq(userApiKeys.id, keyId),
          eq(userApiKeys.userId, userId)
        )
      )
      .limit(1);

    if (key.length === 0) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Delete the key
    await db
      .delete(userApiKeys)
      .where(eq(userApiKeys.id, keyId));

    res.json({
      success: true,
      message: 'API key deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
});

// POST /user/api-keys/validate - Validate an API key
router.post('/validate', async (req: AuthRequest, res: Response) => {
  try {
    // Validate request body
    const validation = validateApiKeySchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid request data',
        details: validation.error.errors 
      });
    }

    const { provider, apiKey } = validation.data;

    // Test the API key based on provider
    try {
      if (provider === 'openai') {
        // Test OpenAI key with a simple request
        const openai = new OpenAI({ apiKey });
        
        // Use a minimal request to test the key
        const response = await openai.models.list();
        
        // If we get here, the key is valid
        res.json({
          success: true,
          valid: true,
          message: 'API key is valid'
        });
      } else {
        // Add support for other providers as needed
        res.status(400).json({
          error: 'Provider not yet supported',
          provider
        });
      }
    } catch (providerError: any) {
      // API key is invalid or has other issues
      console.error('API key validation error:', providerError.message);
      
      let errorMessage = 'Invalid API key';
      if (providerError.message?.includes('rate limit')) {
        errorMessage = 'API key rate limit exceeded';
      } else if (providerError.message?.includes('quota')) {
        errorMessage = 'API key quota exceeded';
      }

      res.json({
        success: false,
        valid: false,
        message: errorMessage
      });
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    res.status(500).json({ error: 'Failed to validate API key' });
  }
});

// PATCH /user/api-keys/:id/toggle - Toggle active status
router.patch('/:id/toggle', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const keyId = parseInt(req.params.id);
    if (isNaN(keyId)) {
      return res.status(400).json({ error: 'Invalid key ID' });
    }

    // Verify ownership
    const [key] = await db
      .select()
      .from(userApiKeys)
      .where(
        and(
          eq(userApiKeys.id, keyId),
          eq(userApiKeys.userId, userId)
        )
      )
      .limit(1);

    if (!key) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Toggle active status
    const [updatedKey] = await db
      .update(userApiKeys)
      .set({
        isActive: !key.isActive,
        updatedAt: new Date()
      })
      .where(eq(userApiKeys.id, keyId))
      .returning({
        id: userApiKeys.id,
        provider: userApiKeys.provider,
        isActive: userApiKeys.isActive,
        updatedAt: userApiKeys.updatedAt
      });

    res.json({
      success: true,
      message: `API key ${updatedKey.isActive ? 'activated' : 'deactivated'}`,
      apiKey: updatedKey
    });
  } catch (error) {
    console.error('Error toggling API key:', error);
    res.status(500).json({ error: 'Failed to toggle API key status' });
  }
});

export default router;