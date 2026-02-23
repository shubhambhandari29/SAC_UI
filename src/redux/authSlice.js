import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Login failed");
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      // call the backend to validate cookie & return user info
      const { data } = await api.get("/auth/me/", { withCredentials: true });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch user"
      );
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/refresh/");
      return data.token;
    } catch (err) {
      return rejectWithValue("Refresh failed");
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post("/auth/logout");
  } catch {}
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loggingin";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.accessToken = action.payload.token;
        state.error = null;
        state.status = "idle";
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.error = null;
        state.status = "idle";
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "idle";
      })
      .addCase(refreshTokenThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.status = "idle";
      })
      .addCase(logoutThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = "idle";
      });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
