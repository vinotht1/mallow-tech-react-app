import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserListApi, createUserApi, updateUserApi, deleteUserApi } from "../../../middleware/apiFunctions";

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

// Fetch Users
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

// Create User
export const createUser = createAsyncThunk<
  User,
  User,
  { rejectValue: UserListError }
>("users/createUser", async (newUser, { rejectWithValue }) => {
  const response = await createUserApi(newUser);
  if ("error" in response && response.error) {
    return rejectWithValue(response);
  }
  return response as User;
});

// Update User
export const updateUser = createAsyncThunk<
  User,
  { id: number; data: Partial<User> },
  { rejectValue: UserListError }
>("users/updateUser", async ({ id, data }, { rejectWithValue }) => {
  const response = await updateUserApi(id, data);
  if ("error" in response && response.error) {
    return rejectWithValue(response);
  }
  return response as User;
});

// Delete User
export const deleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: UserListError }
>("users/deleteUser", async (id, { rejectWithValue }) => {
  const response = await deleteUserApi(id);
  if ("error" in response && response.error) {
    return rejectWithValue(response);
  }
  return id;
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
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
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "An error occurred";
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "An error occurred";
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "An error occurred";
      });
  },
});

export const selectUsers = (state: { users: UsersState }) => state.users.users;
export const selectPagination = (state: { users: UsersState }) =>
  state.users.pagination;
export const selectLoading = (state: { users: UsersState }) =>
  state.users.isLoading;
export const selectErrorMessage = (state: { users: UsersState }) =>
  state.users.errorMessage;

export default usersSlice.reducer;
