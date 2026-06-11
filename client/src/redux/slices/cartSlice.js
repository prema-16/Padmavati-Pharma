import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import toast from "react-hot-toast";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try { const res = await api.get("/cart"); return res.data.cart; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addToCart = createAsyncThunk("cart/add", async (data, { rejectWithValue }) => {
  try { const res = await api.post("/cart/add", data); toast.success("Added to cart"); return res.data.cart; }
  catch (err) { toast.error(err.response?.data?.message || "Failed"); return rejectWithValue(err.response?.data?.message); }
});

export const updateCart = createAsyncThunk("cart/update", async (data, { rejectWithValue }) => {
  try { const res = await api.put("/cart/update", data); return res.data.cart; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const removeFromCart = createAsyncThunk("cart/remove", async (productId, { rejectWithValue }) => {
  try { const res = await api.delete(`/cart/remove/${productId}`); return res.data.cart; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const clearCart = createAsyncThunk("cart/clear", async (_, { rejectWithValue }) => {
  try { await api.delete("/cart/clear"); return { items: [], subtotal: 0, gstAmount: 0, total: 0 }; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], subtotal: 0, gstAmount: 0, total: 0, loading: false },
  reducers: { resetCart(state) { state.items = []; state.subtotal = 0; state.gstAmount = 0; state.total = 0; } },
  extraReducers: (b) => {
    const setCart = (state, action) => { if (action.payload) Object.assign(state, action.payload); state.loading = false; };
    b.addCase(fetchCart.pending, (s) => { s.loading = true; })
     .addCase(fetchCart.fulfilled, setCart)
     .addCase(addToCart.fulfilled, setCart)
     .addCase(updateCart.fulfilled, setCart)
     .addCase(removeFromCart.fulfilled, setCart)
     .addCase(clearCart.fulfilled, setCart);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
