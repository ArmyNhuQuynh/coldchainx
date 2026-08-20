import { getStoredAccessToken } from "@/lib/auth-session";
import envConfig from "@/schemas/config.schema";
import type { TIncidentRealtimeEvent } from "@/schemas/notification.schema";
import {
  extractIncidentIdFromRealtimePayload,
  INCIDENT_REALTIME_EVENTS,
} from "@/lib/incident-notification-events";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr";

type Listener = (event: TIncidentRealtimeEvent) => void;

const getHubUrl = () => {
  const apiBaseUrl = envConfig.VITE_API_BASE_URL.replace(/\/+$/, "");
  const appBaseUrl = apiBaseUrl.endsWith("/api")
    ? apiBaseUrl.slice(0, -4)
    : apiBaseUrl;
  return `${appBaseUrl}/hubs/notifications`;
};

class IncidentNotificationSignalR {
  private connection: HubConnection | null = null;
  private listeners = new Set<Listener>();
  private startPromise: Promise<void> | null = null;
  private stopTimer: ReturnType<typeof setTimeout> | null = null;

  subscribe(listener: Listener) {
    if (this.stopTimer) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
    this.listeners.add(listener);
    void this.start();
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stopTimer = setTimeout(() => {
          this.stopTimer = null;
          if (this.listeners.size === 0) void this.stop();
        }, 250);
      }
    };
  }

  private buildConnection() {
    const connection = new HubConnectionBuilder()
      .withUrl(getHubUrl(), {
        accessTokenFactory: () => getStoredAccessToken() ?? "",
      })
      .withAutomaticReconnect([0, 2_000, 5_000, 10_000, 30_000])
      .configureLogging(LogLevel.Warning)
      .build();

    INCIDENT_REALTIME_EVENTS.forEach((eventName) => {
      connection.on(eventName, (raw: unknown) => {
        const payload =
          raw && typeof raw === "object" && !Array.isArray(raw)
            ? (raw as Record<string, unknown>)
            : { value: raw };
        const event: TIncidentRealtimeEvent = {
          eventName,
          payload,
          incidentId: extractIncidentIdFromRealtimePayload(payload),
        };
        this.listeners.forEach((listener) => listener(event));
      });
    });

    this.connection = connection;
    return connection;
  }

  async start() {
    if (!getStoredAccessToken() || this.listeners.size === 0) return;
    if (this.startPromise) return this.startPromise;
    const connection = this.connection ?? this.buildConnection();
    if (
      connection.state === HubConnectionState.Connected ||
      connection.state === HubConnectionState.Connecting ||
      connection.state === HubConnectionState.Reconnecting
    ) {
      return;
    }
    this.startPromise = connection
      .start()
      .catch(() => undefined)
      .finally(() => {
        this.startPromise = null;
      });
    return this.startPromise;
  }

  async stop() {
    const connection = this.connection;
    if (!connection) return;
    this.connection = null;
    try {
      await connection.stop();
    } catch {
      // Connection may already be closing during auth/logout or StrictMode cleanup.
    }
  }
}

export const incidentNotificationSignalR = new IncidentNotificationSignalR();
