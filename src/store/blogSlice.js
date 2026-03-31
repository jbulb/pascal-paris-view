import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import mockBlogItems from '../mock/data/mockBlogItems.json';

// ---------------------------------------------------------------------------
// Async thunk: fetch blog items from API, fall back to mock data on failure
// ---------------------------------------------------------------------------
export const fetchBlogItems = createAsyncThunk(
  'blog/fetchBlogItems',
  async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();

    const data = json.blogItems ?? [];
    // If the API returned an empty array, fall back to mock data
    return data.length > 0 ? data : mockBlogItems;
  }
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const blogSlice = createSlice({
  name: 'blog',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogItems.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBlogItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBlogItems.rejected, (state) => {
        // Fall back to mock data on network / server errors
        state.status = 'failed';
        state.items = mockBlogItems;
        state.error = 'Failed to fetch blog items';
      });
  },
});

export default blogSlice.reducer;
