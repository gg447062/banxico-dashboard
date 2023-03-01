import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  status: 'idle',
  entities: {},
};

export const fetchData = createAsyncThunk(
  'visualizations/fetchData',
  async (params) => {
    console.log(process.env.NEXT_PUBLIC_BANXICO_TOKEN);
    const { data } = await axios.get(
      `https://5i8qcjp333.execute-api.us-east-1.amazonaws.com/dev/series/${params.seriesString}/datos/?fechaI=${params.startDate}&fechaF=${params.endDate}&locale=${params.language}`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_TUKAN_TOKEN,
          'Bmx-Token': process.env.NEXT_PUBLIC_BANXICO_TOKEN,
        },
      }
    );
    console.log(data);
    return { payload: data, type: params.type };
  }
);

export const visualizationSlice = createSlice({
  name: 'visualizations',
  initialState,
  reducers: {
    remove: (state, action) => {
      delete state.entities[action.payload];
    },
    update: (state, action) => {
      state.entities[action.id] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const visualization = action.payload;
      visualization.type = action.type;
      state.entities[visualization.id] = visualization;
      state.status = 'idle';
    });
  },
});

export const { remove, update } = visualizationSlice.actions;

export default visualizationSlice.reducer;
