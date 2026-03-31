import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockFeaturedProducts from '../mock/data/mockFeaturedProducts.json';
import mockBiomineralProducts from '../mock/data/mockBiomineralProducts.json';
import mockBotanicalProducts from '../mock/data/mockBotanicalProducts.json';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const mockDataByType = {
  featured: mockFeaturedProducts,
  biomineral: mockBiomineralProducts,
  botanical: mockBotanicalProducts,
};

// ---------------------------------------------------------------------------
// Async thunk: fetch products by type (featured | biomineral | botanical)
// Dispatched as:  dispatch(fetchProducts({ url, productType }))
// ---------------------------------------------------------------------------
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ url, productType }) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();

    // The old API could return { products: [...] } or { featuredProducts: [...] }
    let data = json.products ?? json.featuredProducts ?? [];
    if (data.length === 0) {
      data = mockDataByType[productType] ?? [];
    }

    return { productType, products: data };
  }
);

// ---------------------------------------------------------------------------
// Slice  (merges old featured-products + products reducers)
// ---------------------------------------------------------------------------
const productsSlice = createSlice({
  name: 'products',
  initialState: {
    featured: [],
    biomineral: [],
    botanical: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { productType, products } = action.payload;
        state.status = 'succeeded';
        state[productType] = products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        // Fall back to mock data on failure
        const productType = action.meta.arg.productType;
        state.status = 'failed';
        state[productType] = mockDataByType[productType] ?? [];
        state.error = `Failed to fetch ${productType} products`;
      });
  },
});

export default productsSlice.reducer;
