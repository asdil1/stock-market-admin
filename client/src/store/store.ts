import { configureStore} from '@reduxjs/toolkit';
import selectedStocksReducer from './slices/selectedStocksSlice';

const store = configureStore({
    reducer: {
        stock: selectedStocksReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;