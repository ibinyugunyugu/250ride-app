import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducer';

const store = configureStore({reducer,middleware: () => []});

export default store;
