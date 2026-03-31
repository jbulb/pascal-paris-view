import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: sessionStorage.getItem('userToken') || null,
  },

  reducers: {
    userSignedIn(state, action) {
      const token = action.payload;
      sessionStorage.setItem('userToken', token);
      state.token = token;
    },

    userSignedOut(state) {
      sessionStorage.removeItem('userToken');
      state.token = null;
    },
  },
});

export const { userSignedIn, userSignedOut } = userSlice.actions;

export default userSlice.reducer;
