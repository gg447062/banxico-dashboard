import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const initialState = {
  status: 'idle',
  totalPages: 1,
  entities: {},
};

export const fetchSeriesCatalog = createAsyncThunk(
  'catalog/fetchSeriesCatalog',
  async (obj) => {
    const { data } = await axios.get(
      `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/?page=${obj.page}&q=${obj.query}`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_TUKAN_TOKEN,
        },
      }
    );

    return { data: data.data, totalPages: data.totalPages, pageId: obj.page };
  }
);

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSeriesCatalog.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchSeriesCatalog.fulfilled, (state, action) => {
      state.entities[action.payload.pageId] = action.payload.data;
      state.totalPages = action.payload.totalPages;
      state.status = 'idle';
    });
  },
});

export default catalogSlice.reducer;
