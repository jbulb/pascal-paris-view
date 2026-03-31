import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockPaymentClientToken from '../mock/data/mockPaymentClientToken.json';

// ---------------------------------------------------------------------------
// Async thunk: fetch Braintree payment client token
// ---------------------------------------------------------------------------
export const fetchPaymentClientToken = createAsyncThunk(
  'cart/fetchPaymentClientToken',
  async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    return json.clientToken;
  }
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    paymentClientToken: {
      data: null,
      status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null,
    },
  },

  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existing = state.items.find((item) => item.title === product.title);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },

    removeFromCart(state, action) {
      const title = action.payload;
      state.items = state.items.filter((item) => item.title !== title);
    },

    updateCartQuantity(state, action) {
      const { title, quantity } = action.payload;
      const item = state.items.find((i) => i.title === title);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
    },

    clearCart(state) {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentClientToken.pending, (state) => {
        state.paymentClientToken.status = 'loading';
        state.paymentClientToken.error = null;
      })
      .addCase(fetchPaymentClientToken.fulfilled, (state, action) => {
        state.paymentClientToken.status = 'succeeded';
        state.paymentClientToken.data = action.payload;
      })
      .addCase(fetchPaymentClientToken.rejected, (state) => {
        // Fall back to mock client token on failure
        state.paymentClientToken.status = 'failed';
        state.paymentClientToken.data = mockPaymentClientToken.clientToken;
        state.paymentClientToken.error = 'Failed to fetch payment client token';
      });
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
