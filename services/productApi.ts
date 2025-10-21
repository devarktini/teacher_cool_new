import ApiService from './api';
import { Product } from '@/types/api';

class ProductApiService {
  private static basePath = '/products';

  static async getAllProducts() {
    return ApiService.get<Product[]>(this.basePath);
  }

  static async getProductById(id: number) {
    return ApiService.get<Product>(`${this.basePath}/${id}`);
  }

  static async createProduct(data: Omit<Product, 'id'>) {
    return ApiService.post<Product>(this.basePath, data);
  }

  static async updateProduct(id: number, data: Partial<Product>) {
    return ApiService.put<Product>(`${this.basePath}/${id}`, data);
  }

  static async deleteProduct(id: number) {
    return ApiService.delete<void>(`${this.basePath}/${id}`);
  }
}

export default ProductApiService;
