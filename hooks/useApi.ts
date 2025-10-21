import { useState, useCallback } from 'react';
import ApiService from '@/services/api';
import { ApiResponse } from '@/types/api';

export function useApi<T>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    method: 'get' | 'post',
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T> | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await (method === 'get'
        ? ApiService.get<T>(endpoint)
        : ApiService.post<T>(endpoint, data)
      );

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
}
