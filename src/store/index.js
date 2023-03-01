import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import visualizationSlice from './visualizations';

export const store = configureStore({
  reducer: {
    visualizations: visualizationSlice,
  },
  devTools: true,
});

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
