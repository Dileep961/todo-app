import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('auth', JSON.stringify(state));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('auth');
    },
    loadAuthFromStorage: (state) => {
      const storedAuth = JSON.parse(localStorage.getItem('auth'));
      if (storedAuth) {
        state.isAuthenticated = storedAuth.isAuthenticated;
        state.user = storedAuth.user;
      }
    },
  },
});

export const { login, logout, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;