// lib/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: string | null;
  phone: string | null;
  name: string | null;
}

const initialState: AuthState = {
  userId: null,
  phone: null,
  name: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ userId: string; phone: string; name: string }>) {
      state.userId = action.payload.userId;
      state.phone = action.payload.phone;
      state.name = action.payload.name;
    },
    clearUser(state) {
      state.userId = null;
      state.phone = null;
      state.name = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
