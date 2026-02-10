import { ApiError, ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiService {
  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");

    // ✅ Handle non-JSON responses (like HTML errors)
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();

      // Check if it's an HTML error page
      if (text.includes('<!doctype html>') || text.includes('Server Error')) {
        console.error('Server returned HTML error page:', response.status);
        throw new Error(`Server error (${response.status}). Please try again later.`);
      }

      // If it's not HTML but still not JSON, throw with limited text
      throw new Error(`Unexpected response format: ${text.slice(0, 100)}`);
    }

    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = data;
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return data;
  }


  private static async fetchRequest(
    endpoint: string,
    options: RequestInit = {},
    auth: boolean = false
  ) {
    const headers: Record<string, string> = {
      
    };

    if (auth) {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      cache: 'no-store',
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    return response;
  }

  static async get<T>(endpoint: string, auth = false): Promise<ApiResponse<T>> {
    const response = await this.fetchRequest(endpoint, {}, auth);
    return this.handleResponse<T>(response);
  }

  static async post<T>(endpoint: string, data: any, auth = false): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const response = await this.fetchRequest(
      endpoint,
      {
        method: 'POST',
        body,
      },
      auth
    );
    return this.handleResponse<T>(response);
  }

  static async put<T>(endpoint: string, data: any, auth = false): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const response = await this.fetchRequest(
      endpoint,
      {
        method: 'PUT',
        body,
      },
      auth
    );
    return this.handleResponse<T>(response);
  }

  static async patch<T>(endpoint: string, data: any, auth = false): Promise<ApiResponse<T>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const response = await this.fetchRequest(
      endpoint,
      {
        method: 'PATCH',
        body,
      },
      auth
    );
    return this.handleResponse<T>(response);
  }

  static async delete<T>(endpoint: string, auth = false): Promise<ApiResponse<T>> {
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




// import { ApiError, ApiResponse } from '@/types/api';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// class ApiService {
//   private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
//     if (!response.ok) {
//       const error: ApiError = await response.json();
//       throw new Error(error.message || 'API Error');
//     }
//     return response.json();
//   }

//   /**
//    * Fetch wrapper with optional auth and FormData handling
//    */
//   private static async fetchRequest(
//     endpoint: string,
//     options: RequestInit = {},
//     auth: boolean = false
//   ) {
//     const headers: Record<string, string> = {};

//     // Add Authorization header if needed
//     if (auth) {
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
//       if (token) headers['Authorization'] = `Bearer ${token}`;
//     }

//     // ✅ Only set Content-Type if body is NOT FormData
//     const isFormData = options.body instanceof FormData;
//     if (!isFormData) {
//       headers['Content-Type'] = 'application/json';
//     }

//     const response = await fetch(`${API_URL}${endpoint}`, {
//       ...options,
//       headers: {
//         ...headers,
//         ...options.headers,
//       },
//     });

//     return response;
//   }

//   static async get<T>(endpoint: string, auth = false): Promise<ApiResponse<T>> {
//     const response = await this.fetchRequest(endpoint, {}, auth);
//     return this.handleResponse<T>(response);
//   }

//   static async post<T>(endpoint: string, data: any, auth = false): Promise<ApiResponse<T>> {
//     const body = data instanceof FormData ? data : JSON.stringify(data);
//     const response = await this.fetchRequest(
//       endpoint,
//       {
//         method: 'POST',
//         body,
//       },
//       auth
//     );
//     return this.handleResponse<T>(response);
//   }

//   static async put<T>(endpoint: string, data: any, auth = false): Promise<ApiResponse<T>> {
//     const body = data instanceof FormData ? data : JSON.stringify(data);
//     const response = await this.fetchRequest(
//       endpoint,
//       {
//         method: 'PUT',
//         body,
//       },
//       auth
//     );
//     return this.handleResponse<T>(response);
//   }

//   // ✅ NEW PATCH METHOD (works for both FormData and JSON)
//   static async patch<T>(endpoint: string, data: any, auth = false): Promise<ApiResponse<T>> {
//     const body = data instanceof FormData ? data : JSON.stringify(data);
//     const response = await this.fetchRequest(
//       endpoint,
//       {
//         method: 'PATCH',
//         body,
//       },
//       auth
//     );
//     return this.handleResponse<T>(response);
//   }

//   static async delete<T>(endpoint: string, auth = false): Promise<ApiResponse<T>> {
//     const response = await this.fetchRequest(
//       endpoint,
//       {
//         method: 'DELETE',
//       },
//       auth
//     );
//     return this.handleResponse<T>(response);
//   }
// }

// export default ApiService;
