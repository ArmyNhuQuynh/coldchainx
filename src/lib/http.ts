import envConfig from "@/schemas/config.schema";
import axios, { type AxiosInstance } from "axios";

const parseParams = (params: any) => {
  const keys = Object.keys(params);
  let options = "";

  keys.forEach((key) => {
    const isParamTypeObject = typeof params[key] === "object";
    const isParamTypeArray =
      isParamTypeObject &&
      Array.isArray(params[key]) &&
      params[key].length >= 0;

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`;
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach((element: any) => {
        options += `${key}=${element}&`;
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

const request = (apiUrl: string): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: apiUrl,
    paramsSerializer: parseParams,
    withCredentials: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  axiosInstance.interceptors.request.use((options) => {
    const { method, data } = options;

    if (method === "put" || method === "post" || method === "patch") {
      if (data instanceof FormData) {
        // Nếu body là FormData, đặt Content-Type là multipart/form-data
        Object.assign(options.headers!, {
          "Content-Type": "multipart/form-data",
        });
      } else {
        // Nếu không, giữ Content-Type là application/json
        Object.assign(options.headers!, {
          "Content-Type": "application/json;charset=UTF-8",
        });
      }
    }

    return options;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );
  return axiosInstance;
};

const baseApi = request(envConfig.VITE_API_BASE_URL);


export const apiRequest = {
  baseApi,

}