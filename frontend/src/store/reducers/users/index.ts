import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TUserState = {
  id: string;
  email: string;
  firstName: string;
};

const initialState: TUserState = {
  id: "",
  email: "",
  firstName: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUserState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
    },
    clearUser: (state) => {
      state.id = "";
      state.email = "";
      state.firstName = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
