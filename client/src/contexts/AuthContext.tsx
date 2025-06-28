import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  email: string;
  username: string;
  lastLogin?: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token management
const TOKEN_KEY = 'access_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  // JWT tokens have expiry encoded, but we'll also track it separately
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 14); // 14 minutes (1 minute before actual expiry)
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toISOString());
}

function getAccessToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiry) return null;
  
  // Check if token is expired
  if (new Date(expiry) < new Date()) {
    clearTokens();
    return null;
  }
  
  return token;
}

function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

// Add auth header to API client
apiClient.interceptors = {
  request: (config: any) => {
    const token = getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  response: async (response: any) => {
    // If we get a 401, try to refresh the token
    if (response.status === 401) {
      try {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include', // Include cookies
        });
        
        if (refreshResponse.ok) {
          const { accessToken } = await refreshResponse.json();
          setAccessToken(accessToken);
          
          // Retry the original request
          const token = getAccessToken();
          if (token) {
            response.config.headers.Authorization = `Bearer ${token}`;
            return fetch(response.config.url, response.config);
          }
        }
      } catch (error) {
        // Refresh failed, user needs to login again
        clearTokens();
      }
    }
    return response;
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getAccessToken();
      if (token) {
        refreshToken();
      }
    }, 10 * 60 * 1000); // Check every 10 minutes

    return () => clearInterval(interval);
  }, []);

  const checkAuth = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await apiClient.get<User>('/auth/me');
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{
        user: User;
        accessToken: string;
      }>('/auth/login', { email, password });

      if (response.data) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${response.data.user.username}`,
        });
        
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const response = await apiClient.post<{
        user: User;
        accessToken: string;
      }>('/auth/register', { email, username, password });

      if (response.data) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        
        toast({
          title: 'Welcome to KeyFrames!',
          description: 'Your account has been created successfully',
        });
        
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Could not create account',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local state
    } finally {
      clearTokens();
      setUser(null);
      
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully',
      });
      
      navigate('/login');
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const { accessToken } = await response.json();
        setAccessToken(accessToken);
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      clearTokens();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route component
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}