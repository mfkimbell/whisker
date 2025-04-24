// lib/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: string | null;
  phone: string | null;
  name: string | null;
  conversationId: string | null | undefined;
}

const initialState: AuthState = {
  userId: null,
  phone: null,
  name: null,
  conversationId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(
      state,
      action: PayloadAction<{
        userId: string;
        phone: string;
        name: string;
        conversationId?: string;
      }>,
    ) {
      state.userId = action.payload.userId;
      state.phone = action.payload.phone;
      state.name = action.payload.name;
      state.conversationId = action.payload.conversationId ?? null;
    },
    updateConversationId(state, action: PayloadAction<string>) {
      state.conversationId = action.payload;
    },
    clearUser(state) {
      state.userId = null;
      state.phone = null;
      state.name = null;
      state.conversationId = null;
    },
  },
});

export const { setUser, updateConversationId, clearUser } = authSlice.actions;
export default authSlice.reducer;
