import envConfig from "@/schemas/config.schema";
import type { TAuthResponse } from "@/schemas/auth.schema";
import type { BaseResponse } from "@/types/response.type";
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const AUTH_REFRESHED_EVENT = "coldchainx:auth-refreshed";
const AUTH_CLEARED_EVENT = "coldchainx:auth-cleared";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const authStorageKeys = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  user: "user",
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

const getAuthResponseData = (payload: unknown): TAuthResponse | null => {
  const maybeAuthResponse = payload as TAuthResponse | undefined;

  if (maybeAuthResponse?.accessToken) {
    return maybeAuthResponse;
  }

  const maybeBaseResponse = payload as BaseResponse<TAuthResponse> | undefined;

  return maybeBaseResponse?.data?.accessToken ? maybeBaseResponse.data : null;
};

const emitAuthEvent = (eventName: string, detail?: TAuthResponse) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(eventName, { detail }));
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

  const setAuthorizationHeader = (token: string) => {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  };

  const clearStoredAuthData = () => {
    localStorage.removeItem(authStorageKeys.accessToken);
    localStorage.removeItem(authStorageKeys.refreshToken);
    localStorage.removeItem(authStorageKeys.user);
    delete axiosInstance.defaults.headers.common.Authorization;
    emitAuthEvent(AUTH_CLEARED_EVENT);
  };

  let refreshPromise: Promise<TAuthResponse> | null = null;

  const persistAuthData = (authData: TAuthResponse) => {
    localStorage.setItem(authStorageKeys.accessToken, authData.accessToken);

    if (authData.refreshToken) {
      localStorage.setItem(authStorageKeys.refreshToken, authData.refreshToken);
    }

    const storedUser = localStorage.getItem(authStorageKeys.user);
    const nextUser = storedUser
      ? { ...JSON.parse(storedUser), ...authData }
      : authData;

    localStorage.setItem(authStorageKeys.user, JSON.stringify(nextUser));
    setAuthorizationHeader(authData.accessToken);
    emitAuthEvent(AUTH_REFRESHED_EVENT, nextUser);
  };

  const refreshAuthSession = async () => {
    const refreshToken = localStorage.getItem(authStorageKeys.refreshToken);

    if (!refreshToken) {
      throw new Error("Missing refresh token");
    }

    const response = await refreshClient.post<BaseResponse<TAuthResponse>>(
      `${API_AUTH_PREFIX}/refresh-tokens`,
      JSON.stringify(refreshToken),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const authData = getAuthResponseData(response.data);

    if (!authData) {
      throw new Error("Refresh response does not include an access token");
    }

    persistAuthData(authData);
    return authData;
  };

  refreshStoredAuthSession = () => {
    refreshPromise ??= refreshAuthSession().finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  };

  axiosInstance.interceptors.request.use((options) => {
    const { method, data } = options;
    const accessToken = localStorage.getItem(authStorageKeys.accessToken);

    if (accessToken && !getHeader(options.headers, "Authorization")) {
      setHeader(options.headers, "Authorization", `Bearer ${accessToken}`);
    }

    if (method === "put" || method === "post" || method === "patch") {
      if (data instanceof FormData) {
        deleteHeader(options.headers, "Content-Type");
      } else {
        const contentType = getHeader(options.headers, "Content-Type");

        if (!contentType) {
          setHeader(options.headers, "Content-Type", "application/json;charset=UTF-8");
        }
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
        clearStoredAuthData();
        return Promise.reject(refreshError);
      }
    }
  );
  return axiosInstance;
};

const API_AUTH_PREFIX = "/auth";

export let refreshStoredAuthSession: () => Promise<TAuthResponse> = () =>
  Promise.reject(new Error("HTTP client has not been initialized"));

export const authSessionEvents = {
  refreshed: AUTH_REFRESHED_EVENT,
  cleared: AUTH_CLEARED_EVENT,
};

const baseApi = request(envConfig.VITE_API_BASE_URL);


export const apiRequest = {
  baseApi,
  

}
