import { createSlice } from '@reduxjs/toolkit';

// ---------------------------------------------------------------------------
// Cart items are identified by stable product id when available (ids survive
// title edits in the admin). Title is the fallback key for items that were
// persisted in browsers before ids existed. The key is internal only — it is
// never shown to users.
// ---------------------------------------------------------------------------
export const cartItemKey = (item) =>
  item.id != null ? `id:${item.id}` : `title:${item.title}`;

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
      const key = cartItemKey(product);
      const existing = state.items.find((item) => cartItemKey(item) === key);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },

    removeFromCart(state, action) {
      const key = action.payload;
      state.items = state.items.filter((item) => cartItemKey(item) !== key);
    },

    updateCartQuantity(state, action) {
      const { key, quantity } = action.payload;
      const item = state.items.find((i) => cartItemKey(i) === key);
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
