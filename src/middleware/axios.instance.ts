import axios from "axios";
const SECONDS = 30;
const MILISECONDS = 1000;
const TIMEOUT = SECONDS * MILISECONDS;

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: TIMEOUT,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_AUTHORIZATION_KEY}`,
  },
});
const APIREQUEST = {
  post: async (url = "", data = {}) => {
    async function apiCall() {
      return instance({
        method: "POST",
        url: url,
        data: data,
      });
    }
    const postData = await apiCall();
    return postData?.data;
  },
  get: async (url = "", params = {}) => {
    async function apiCall() {
      return instance({
        method: "GET",
        url: url,
        params: params,
      });
    }
    const getData = await apiCall();
    return getData?.data;
  },
};
export default APIREQUEST;
