import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '@/types/api'
import type { RootState } from '../store'

interface CartItem extends Product {
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
}

const initialState: CartState = {
  items: [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 199.99,
      description: 'Premium noise-canceling wireless headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      quantity: 1
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 299.99,
      description: 'Latest generation smartwatch with health tracking',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop',
      quantity: 2
    }
  ],
  total: 799.97 // 199.99 + (299.99 * 2)
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      state.total += action.payload.price
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload)
      if (item) {
        state.total -= item.price * item.quantity
        state.items = state.items.filter(item => item.id !== action.payload)
      }
    },
  },
})

export const { addItem, removeItem } = cartSlice.actions
export const selectCart = (state: RootState) => state.cart
export default cartSlice.reducer
