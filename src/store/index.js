import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import visualizerSlice from './visualizers';

export const store = configureStore({
  reducer: {
    visualizers: visualizerSlice,
  },
  devTools: true,
});

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
