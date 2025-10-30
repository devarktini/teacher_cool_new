import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { LoginCredentials } from '@/types/user'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
      if (endpoint !== 'getUserType') {
        const token = (getState() as any).auth?.token
        if (token) headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<
      { id: string; user_type: string; token: string ,user:any},
      LoginCredentials
    >({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        if (response.success) {
          return {
            id: response?.data?.id,
            user_type: response?.user_type,
            user:response?.data,
            token: response?.access,
          }
        } else {
          throw new Error(response?.message || 'Login failed')
        }
      },
    }),

    getUserType: builder.query<any, void>({
      query: () => '/user/user-type',
    }),
    getCountryLists: builder.query<any, void>({
      query: () => 'user/add/country_list/',
    }),
  }),
})

export const { useLoginMutation, useGetUserTypeQuery, useGetCountryListsQuery } = userApi





// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { AuthResponse, LoginCredentials, RegisterData, User } from '@/types/user'

// export const userApi = createApi({
//   reducerPath: 'userApi',
//   baseQuery: fetchBaseQuery({ 
//     baseUrl: process.env.NEXT_PUBLIC_API_URL,
//     prepareHeaders: (headers, { getState }) => {
//       // Add auth header with JWT token if available
//       const token = (getState() as any).auth.token
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`)
//       }
//       return headers
//     },
//   }),
//   endpoints: (builder) => ({
//     login: builder.mutation<AuthResponse, LoginCredentials>({
//       query: (credentials) => ({
//         url: '/auth/login',
//         method: 'POST',
//         body: credentials,
//       }),
//       transformErrorResponse: (response) => {
//         return { status: response.status, data: response.data }
//       },
//     }),
//     register: builder.mutation<AuthResponse, RegisterData>({
//       query: (data) => ({
//         url: '/auth/register',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     getProfile: builder.query<User, void>({
//       query: () => '/auth/profile',
//     }),
//   }),
// })

// export const {
//   useLoginMutation,
//   useRegisterMutation,
//   useGetProfileQuery,
// } = userApi
