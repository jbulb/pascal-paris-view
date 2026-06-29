import { createSlice } from '@reduxjs/toolkit';

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
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
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
