import { configureStore } from '@reduxjs/toolkit';
import transcodeReducer from './transcodeSlice';

const store = configureStore({
  reducer: {
    transcode: transcodeReducer,
  },
});

export default store;
