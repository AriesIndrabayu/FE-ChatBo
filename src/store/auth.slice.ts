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
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { userId, session, profile } = action.payload;

      state.userId = userId;
      state.session = session;
      state.profile = profile;
      state.isLogin = true;
    },
    logout: (state) => {
      state.userId = null;
      state.session = null;
      state.profile = null;
      state.isLogin = false;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
