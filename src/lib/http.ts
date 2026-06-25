import {
  API_AUTH_PREFIX,
  clearStoredAuthSession,
  configureAuthSession,
  getStoredAccessToken,
  refreshStoredAuthSession,
} from "@/lib/auth-session";
import envConfig from "@/schemas/config.schema";
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const setHeader = (
  headers: InternalAxiosRequestConfig["headers"],
  key: string,
  value: string
) => {
  if (typeof headers?.set === "function") {
    headers.set(key, value);
    return;
  }

  Object.assign(headers!, { [key]: value });
};

const getHeader = (
  headers: InternalAxiosRequestConfig["headers"],
  key: string
) => {
  if (typeof headers?.get === "function") {
    return headers.get(key);
  }

  return (headers as Record<string, string | undefined> | undefined)?.[key];
};

const deleteHeader = (
  headers: InternalAxiosRequestConfig["headers"],
  key: string
) => {
  if (typeof headers?.delete === "function") {
    headers.delete(key);
    return;
  }

  delete (headers as Record<string, string | undefined> | undefined)?.[key];
};

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
  const refreshClient = axios.create({
    baseURL: apiUrl,
    withCredentials: false,
  });

  const axiosInstance = axios.create({
    baseURL: apiUrl,
    paramsSerializer: parseParams,
    withCredentials: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  configureAuthSession({
    refreshClient,
    onAccessToken: (token) => {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    onClear: () => {
      delete axiosInstance.defaults.headers.common.Authorization;
    },
  });

  axiosInstance.interceptors.request.use((options) => {
    const { method, data } = options;
    const accessToken = getStoredAccessToken();

    if (accessToken && !getHeader(options.headers, "Authorization")) {
      setHeader(options.headers, "Authorization", `Bearer ${accessToken}`);
    }

    if (method === "put" || method === "post" || method === "patch") {
      if (data instanceof FormData) {
        deleteHeader(options.headers, "Content-Type");
      } else if (!getHeader(options.headers, "Content-Type")) {
        setHeader(options.headers, "Content-Type", "application/json;charset=UTF-8");
      }
    }

    return options;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetriableRequestConfig | undefined;
      const isRefreshRequest = originalRequest?.url?.includes(
        `${API_AUTH_PREFIX}/refresh-tokens`
      );

      if (
        error.response?.status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isRefreshRequest
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const authData = await refreshStoredAuthSession();
        setHeader(
          originalRequest.headers,
          "Authorization",
          `Bearer ${authData.accessToken}`
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearStoredAuthSession();
        return Promise.reject(refreshError);
      }
    }
  );

  return axiosInstance;
};

const baseApi = request(envConfig.VITE_API_BASE_URL);

export const apiRequest = {
  baseApi,
};
