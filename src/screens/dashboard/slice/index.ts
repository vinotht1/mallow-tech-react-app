import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserListApi } from "../../../middleware/apiFunctions";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface UsersResponse {
  data: User[];
  support: {
    url: string;
    text: string;
  };
  pagination: Pagination;
}

interface UserListError {
    error: boolean;
    message: string;
    statusCode?: number;
  }
  
interface UsersState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  users: User[];
  pagination: Pagination | null;
}

const initialState: UsersState = {
  isLoading: false,
  isError: false,
  errorMessage: null,
  users: [],
  pagination: null,
};

export const fetchUsers = createAsyncThunk<
  UsersResponse,
  { page: number },
  { rejectValue: UserListError }
>("users/fetchUsers", async ({ page }, { rejectWithValue }) => {
  const response = await UserListApi(page);
  if ("error" in response && response.error) {
    return rejectWithValue(response);
  }
  return response as UsersResponse;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "An error occurred";
      });
  },
});

export const selectUsers = (state: { users: UsersState }) => state.users.users;
export const selectPagination = (state: { users: UsersState }) => state.users.pagination;
export const selectLoading = (state: { users: UsersState }) => state.users.isLoading;
export const selectErrorMessage = (state: { users: UsersState }) => state.users.errorMessage;

export default usersSlice.reducer;
