import { useState } from 'react';
import ProductApiService from '@/services/productApi';
import { Product } from '@/types/api';

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductApiService.getAllProducts();
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProductApiService.getProductById(id);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchProducts,
    fetchProductById,
  };
}
