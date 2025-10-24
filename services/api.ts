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

  /**
   * Fetch wrapper with optional auth
   */
  private static async fetchRequest(
    endpoint: string,
    options: RequestInit = {},
    auth: boolean = false
  ) {
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header only if needed
    if (auth) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    return response;
  }

  static async get<T>(endpoint: string, auth: boolean = false): Promise<ApiResponse<T>> {
    const response = await this.fetchRequest(endpoint, {}, auth);
    return this.handleResponse<T>(response);
  }

  static async post<T>(endpoint: string, data: any, auth: boolean = false): Promise<ApiResponse<T>> {
    const response = await this.fetchRequest(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      auth
    );
    return this.handleResponse<T>(response);
  }

  static async put<T>(endpoint: string, data: any, auth: boolean = false): Promise<ApiResponse<T>> {
    const response = await this.fetchRequest(
      endpoint,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      auth
    );
    return this.handleResponse<T>(response);
  }

  static async delete<T>(endpoint: string, auth: boolean = false): Promise<ApiResponse<T>> {
    const response = await this.fetchRequest(
      endpoint,
      {
        method: 'DELETE',
      },
      auth
    );
    return this.handleResponse<T>(response);
  }
}

export default ApiService;
