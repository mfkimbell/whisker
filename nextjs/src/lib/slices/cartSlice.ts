// lib/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CartItem = { id: string; name: string; price: number }

interface CartState {
  items: CartItem[]
  abandonedTracked: boolean
}

const initialState: CartState = {
  items: [],
  abandonedTracked: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload)
      state.abandonedTracked = false
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    markAbandonedTracked(state) {
      state.abandonedTracked = true
    },
  },
})

export const { addItem, removeItem, markAbandonedTracked } = cartSlice.actions
export default cartSlice.reducer
