import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SigninApi } from "../../../middleware/apiFunctions";
import { setAccessTokenInLS } from "../../../utils/common";

interface SigninResponse {
  token: string;
}

interface SigninPayload {
  email: string;
  password: string;
}

interface SigninError {
  error: boolean;
  message: string;
  statusCode?: number;
}

export interface SigninState {
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  isLoggedIn: boolean;
  authToken: string | null;
  data: {
    email: string;
    password: string;
  };
}

const initialState: SigninState = {
  isLoading: false,
  isError: false,
  errorMessage: null,
  isLoggedIn: false,
  authToken: null, // Initialize token
  data: {
    email: "",
    password: "",
  },
};

export const signInPost = createAsyncThunk<
  SigninResponse,
  SigninPayload,
  { rejectValue: SigninError }
>("signin/signInPost", async (data, { rejectWithValue }) => {
  const response = await SigninApi(data);
  console.log("response",response)
  if ("error" in response && response.error) {
    console.log("response.error", response);
    return rejectWithValue({
      error: true,
      message: response.message || "Invalid credentials",
      statusCode: response.statusCode,
    });
  }

  return response as SigninResponse;
});

const signinSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {
    setUserLogin: (state, action: PayloadAction<SigninPayload>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInPost.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(signInPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authToken = action.payload.token; // Store the token
        state.isLoggedIn = true;
        setAccessTokenInLS(action.payload.token);
      })
      .addCase(signInPost.rejected, (state, action) => {
        console.error("Error:", action.payload);
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload?.message || "An error occurred";
      });
  },
});

export const { setUserLogin } = signinSlice.actions;

export const selectSignInData = (state: { signin: SigninState }) =>
  state?.signin?.authToken;
export const selectIsLoggedIn = (state: { signin: SigninState }) =>
  state?.signin?.isLoggedIn;
export const selectErrorMessage = (state: { signin: SigninState }) =>
  state?.signin?.errorMessage;

export default signinSlice.reducer;
