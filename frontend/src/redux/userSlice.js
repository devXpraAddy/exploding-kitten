// frontend/src/redux/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (username, thunkAPI) => {
    try {
      const response = await axios.post("/api/login", { username });
      return response.data.username;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk to load leaderboard
export const fetchLeaderboard = createAsyncThunk(
  "user/fetchLeaderboard",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("/api/leaderboard");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    username: "",
    leaderboard: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.username = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.leaderboard = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
