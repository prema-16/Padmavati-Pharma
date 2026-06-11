import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

const stored = localStorage.getItem("user");
const initialUser = stored ? JSON.parse(stored) : null;
const initialToken = localStorage.getItem("token") || null;

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const register = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const res = await api.put("/auth/updateprofile", data);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Update failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: initialUser, token: initialToken, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out");
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
     .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
     .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.token = a.payload.token; })
     .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
     .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload.user; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
