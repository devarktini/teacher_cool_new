import { ApiError, ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiService {
  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'API Error');
    }
    return response.json();
  }

  private static async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      // Add your authentication headers here
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    return response;
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await this.fetchWithAuth(endpoint);
    return this.handleResponse<T>(response);
  }

  static async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await this.fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  // Add other methods (PUT, DELETE, etc.) as needed
}

export default ApiService;
