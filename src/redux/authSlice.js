import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    resetCredentials: state => {
      state.email = '';
      state.password = '';
    },
  },
});

export const {
  setEmail,
  setPassword,
  setAuthStatus,
  setFirstName,
  setLastName,
  setPhoneNumber,
  resetCredentials,
} = authSlice.actions;
export default authSlice.reducer;
