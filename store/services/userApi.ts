import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/user'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      // Add auth header with JWT token if available
      const token = (getState() as any).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformErrorResponse: (response) => {
        return { status: response.status, data: response.data }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => '/auth/profile',
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} = userApi
