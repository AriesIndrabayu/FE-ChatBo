import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  userId: number | null;
  session: string | null;
  profile: any | null;
  isLogin: boolean;
}

const initialState: AuthState = {
  userId: null,
  session: null,
  profile: null,
  isLogin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
