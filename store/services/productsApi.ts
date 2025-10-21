import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product } from '@/types/api'

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => 
        `/products?page=${page}&limit=${limit}`,
      providesTags: ['Products'],
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
} = productsApi
