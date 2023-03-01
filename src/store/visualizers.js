import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  status: 'idle',
  visualizers: {},
};

export const fetchData = createAsyncThunk(
  'visualizers/fetchData',
  async (query) => {
    const response = await axios.get(
      `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/${query.series}/datos/?${query.params}`
    );
    return response.data;
  }
);

export const visualizerSlice = createSlice({
  name: 'visualizers',
  initialState,
  reducers: {
    remove: (state, action) => {
      delete state.visualizers[action.payload];
    },
    update: (state, action) => {
      state.visualizers[action.id] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state, action) => {
      state.status = 'loading';
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const visualizer = action.payload;
      state.visualizers[visualizer.id] = visualizer;
      state.status = 'idle';
    });
  },
});

export const { remove, update } = visualizerSlice.actions;

export default visualizerSlice.reducer;
