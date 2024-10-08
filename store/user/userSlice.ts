// features/userSlice.ts
import { UserRole, UserState } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserState = {
  _id: null,
  fullname: null,
  username: null,
  email: null,
  color: null,
  role: null,
  reservations: [],
  createdAt: null,
  updatedAt: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id;
      state.fullname = action.payload.fullname;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.color = action.payload.color;
      state.role = action.payload.role;
      state.reservations = action.payload.reservations;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
    },
    clearUser: (state) => {
      state._id = null;
      state.fullname = null;
      state.username = null;
      state.email = null;
      state.color = null;
      state.role = null;
      state.reservations = [];
      state.createdAt = null;
      state.updatedAt = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
