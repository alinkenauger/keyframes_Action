/**
 * Professional API Client with retry logic, error handling, and request tracking
 */

interface APIResponse<T> {
  data?: T;
  error?: string;
  status: number;
  requestId?: string;
}

interface APIClientConfig {
  baseURL?: string;
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
}

class APIClient {
  private baseURL: string;
  private retryAttempts: number;
  private retryDelay: number;
  private timeout: number;

  constructor(config: APIClientConfig = {}) {
    this.baseURL = config.baseURL || '/api';
    this.retryAttempts = config.retryAttempts || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.timeout = config.timeout || 30000;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries = this.retryAttempts
  ): Promise<APIResponse<T>> {
    const requestId = this.generateRequestId();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      // Handle rate limiting
      if (response.status === 429 && retries > 0) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : this.retryDelay * 2;
        await this.delay(delay);
        return this.request(endpoint, options, retries - 1);
      }

      // Handle server errors with retry
      if (!response.ok && retries > 0 && this.shouldRetry(response.status)) {
        await this.delay(this.retryDelay * (this.retryAttempts - retries + 1));
        return this.request(endpoint, options, retries - 1);
      }

      // Parse response
      let data: any;
      try {
        data = await response.json();
      } catch (e) {
        // Response might not be JSON
        data = await response.text();
      }

      if (!response.ok) {
        return {
          error: data?.error || `Request failed with status ${response.status}`,
          status: response.status,
          requestId,
        };
      }

      return { data, status: response.status, requestId };
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Handle timeout
      if (error.name === 'AbortError') {
        return {
          error: 'Request timeout',
          status: 408,
          requestId,
        };
      }

      // Handle network errors with retry
      if (retries > 0 && this.isNetworkError(error)) {
        await this.delay(this.retryDelay * (this.retryAttempts - retries + 1));
        return this.request(endpoint, options, retries - 1);
      }

      return {
        error: this.getErrorMessage(error),
        status: 0,
        requestId,
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  private shouldRetry(status: number): boolean {
    // Retry on server errors and timeout
    return [408, 429, 500, 502, 503, 504].includes(status);
  }

  private isNetworkError(error: any): boolean {
    return error.message === 'Failed to fetch' || 
           error.message.includes('NetworkError') ||
           error.message.includes('ERR_NETWORK');
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getErrorMessage(error: any): string {
    if (error.message) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
  }
}

// Create singleton instance
export const apiClient = new APIClient();

// Export types
export type { APIResponse, APIClientConfig };