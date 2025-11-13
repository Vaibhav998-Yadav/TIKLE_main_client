// app/redux/slices/notificationsSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { newDocsNotification } from "@/app/services/api/new_docs_notifications"

export interface NotificationData {
  _id: string
  form: string
  filingDate: string
  cikName: string
  acceptanceDateTime: string
  accessionNumber: string
  ciknumber: number
  primaryDocument: string
  reportDate?: string
  [key: string]: any
}

interface NotificationsState {
  data: NotificationData[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: NotificationsState = {
  data: [],
  status: "idle",
  error: null,
}

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const data = await newDocsNotification()
      if (!data || !Array.isArray(data)) {
        return rejectWithValue("Invalid notifications data")
      }
      return data
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch notifications")
    }
  }
)

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.payload
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload as string
      })
  },
})

export default notificationsSlice.reducer
