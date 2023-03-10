import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import logger from 'redux-logger';
import visualizationSlice from './visualizations';
import catalogSlice from './catalog';

export const store = configureStore({
  reducer: {
    visualizations: visualizationSlice,
    catalog: catalogSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
