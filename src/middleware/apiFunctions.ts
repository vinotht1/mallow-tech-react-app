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


interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  }
  
  interface SupportInfo {
    url: string;
    text: string;
  }
  
  interface Pagination {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }
  
  interface UsersResponse {
    data: User[];
    support: SupportInfo;
    pagination: Pagination;
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

export const UserListApi = async (
    page: number
  ): Promise<UsersResponse | SigninError> => {
    try {
      const response = await APIREQUEST.get(`${endpoints.userList}?page=${page}`);
      if (response?.data) {
        return {
          data: response.data,
          support: response.support,
          pagination: {
            page: response.page,
            per_page: response.per_page,
            total: response.total,
            total_pages: response.total_pages,
          },
        };
      } else {
        return { error: true, message: "No data received from server" };
      }
    } catch (err: any) {
      console.error("Error:", err);
      if (err.response) {
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
  