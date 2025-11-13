import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAllFilings, FilingData } from '@/app/services/api/fetch_all_filings';

interface BDCMetaState {
  data: FilingData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BDCMetaState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchBDCMeta = createAsyncThunk(
  'bdcMeta/fetchBDCMeta',
  async (cik: string, { rejectWithValue }) => {
    const data = await fetchAllFilings(cik);
    if (!data) {
      return rejectWithValue('Failed to fetch data');
    }
    return data;
  }
);

const bdcMetaSlice = createSlice({
  name: 'bdcMeta',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBDCMeta.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBDCMeta.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchBDCMeta.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default bdcMetaSlice.reducer;
