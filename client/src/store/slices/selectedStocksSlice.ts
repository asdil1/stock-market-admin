import { createSlice } from '@reduxjs/toolkit';

interface SelectedStocksState {
    selectedStocks: string[];
}

const initialState: SelectedStocksState = {
    selectedStocks: [],
};

const selectedStocksSlice = createSlice({
    name: 'selectedStocks',
    initialState,
    reducers: {
        toggleStock: (state, action) => {
            if (state.selectedStocks.includes(action.payload)) {
                state.selectedStocks = state.selectedStocks.filter(stock => stock !== action.payload);
            } else {
                state.selectedStocks.push(action.payload);
            }
        },
        clearSelectedStocks: (state) => {
            state.selectedStocks = [];
        }
    },
});

export const { toggleStock, clearSelectedStocks } = selectedStocksSlice.actions;
export default selectedStocksSlice.reducer;