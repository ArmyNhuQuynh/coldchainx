import type { TAuthResponse } from "@/schemas/auth.schema";
import type { BaseResponse } from "@/types/response.type";
import type { AxiosInstance } from "axios";

export const API_AUTH_PREFIX = "/auth";

export const authStorageKeys = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  user: "user",
} as const;

export const authSessionEvents = {
  refreshed: "coldchainx:auth-refreshed",
  cleared: "coldchainx:auth-cleared",
} as const;

type AuthSessionConfig = {
  refreshClient: AxiosInstance;
  onAccessToken?: (token: string) => void;
  onClear?: () => void;
};

let sessionConfig: AuthSessionConfig | null = null;
let refreshPromise: Promise<TAuthResponse> | null = null;

const canUseStorage = () => typeof window !== "undefined";

const emitAuthEvent = (eventName: string, detail?: TAuthResponse) => {
  if (!canUseStorage()) return;

  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};

const getAuthResponseData = (payload: unknown): TAuthResponse | null => {
  const maybeAuthResponse = payload as TAuthResponse | undefined;

  if (maybeAuthResponse?.accessToken) {
    return maybeAuthResponse;
  }

  const maybeBaseResponse = payload as BaseResponse<TAuthResponse> | undefined;
  return maybeBaseResponse?.data?.accessToken ? maybeBaseResponse.data : null;
};

const getMergedStoredUser = (authData: TAuthResponse): TAuthResponse => {
  if (!canUseStorage()) return authData;

  const storedUser = localStorage.getItem(authStorageKeys.user);
  if (!storedUser) return authData;

  try {
    return { ...JSON.parse(storedUser), ...authData };
  } catch {
    return authData;
  }
};

const requireSessionConfig = () => {
  if (!sessionConfig) {
    throw new Error("Auth session has not been configured");
  }

  return sessionConfig;
};

export const configureAuthSession = (config: AuthSessionConfig) => {
  sessionConfig = config;
};

export const getStoredAccessToken = () =>
  canUseStorage() ? localStorage.getItem(authStorageKeys.accessToken) : null;

export const getStoredRefreshToken = () =>
  canUseStorage() ? localStorage.getItem(authStorageKeys.refreshToken) : null;

export const persistAuthSession = (authData: TAuthResponse) => {
  const nextUser = getMergedStoredUser(authData);

  if (canUseStorage()) {
    localStorage.setItem(authStorageKeys.accessToken, authData.accessToken);

    if (authData.refreshToken) {
      localStorage.setItem(authStorageKeys.refreshToken, authData.refreshToken);
    }

    localStorage.setItem(authStorageKeys.user, JSON.stringify(nextUser));
  }

  sessionConfig?.onAccessToken?.(authData.accessToken);
  emitAuthEvent(authSessionEvents.refreshed, nextUser);
};

export const clearStoredAuthSession = () => {
  if (canUseStorage()) {
    localStorage.removeItem(authStorageKeys.accessToken);
    localStorage.removeItem(authStorageKeys.refreshToken);
    localStorage.removeItem(authStorageKeys.user);
  }

  sessionConfig?.onClear?.();
  emitAuthEvent(authSessionEvents.cleared);
};

const refreshAuthSession = async () => {
  const { refreshClient } = requireSessionConfig();
  const refreshToken = getStoredRefreshToken();

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

  persistAuthSession(authData);
  return authData;
};

export const refreshStoredAuthSession = () => {
  refreshPromise ??= refreshAuthSession().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};
