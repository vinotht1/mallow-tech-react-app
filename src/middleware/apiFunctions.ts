import { endpoints } from "./endpoints";
import APIREQUEST from "./axios.instance";

interface SigninResponse {
  token: string;
}

interface SigninError {
  error: boolean;
  message: string;
  statusCode?: number;
}

export const SigninApi = async (
  payload: any
): Promise<SigninResponse | SigninError> => {
  try {
    const response = await APIREQUEST.post(endpoints.signin, payload);
    if (response?.token) {
      return { token: response.token };
    } else {
      return { error: true, message: "No data received from server" };
    }
  } catch (err: any) {
    console.error("Error:", err);
    if (err.response) {
      console.log("response Err", err.response.data.error);
      return {
        error: true,
        message: err.response.data?.error || "Server returned an error",
        statusCode: err.response.status,
      };
    } else if (err.request) {
      return {
        error: true,
        message: "No response from the server. Please try again later.",
      };
    } else {
      return {
        error: true,
        message: "An unexpected error occurred. Please try again.",
      };
    }
  }
};
