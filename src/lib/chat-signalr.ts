import { getStoredAccessToken } from "@/lib/auth-session";
import envConfig from "@/schemas/config.schema";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const getChatHubUrl = () => {
  const apiBaseUrl = envConfig.VITE_API_BASE_URL.replace(/\/+$/, "");
  const appBaseUrl = apiBaseUrl.endsWith("/api")
    ? apiBaseUrl.slice(0, -4)
    : apiBaseUrl;

  return `${appBaseUrl}/hubs/chat`;
};

export const createChatHubConnection = () =>
  new HubConnectionBuilder()
    .withUrl(getChatHubUrl(), {
      accessTokenFactory: () => getStoredAccessToken() ?? "",
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
