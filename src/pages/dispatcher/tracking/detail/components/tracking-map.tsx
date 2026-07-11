import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import envConfig from "@/schemas/config.schema";
import type { TTrackingPoint } from "@/schemas/monitoring.schema";
import { MapPinned } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildLineFeature,
  buildPointFeatureCollection,
  decodePolyline,
  findNearestTrackingPoint,
  pointsToCoordinates,
} from "../utils/map-utils";
import {
  formatCoordinate,
  formatTemperature,
  formatTrackingDateTime,
} from "../../shared/tracking-formatters";

declare global {
  interface Window {
    goongjs?: any;
  }
}

type Props = {
  points: TTrackingPoint[];
  latestPoint?: TTrackingPoint | null;
  actualEncodedPolyline?: string | null;
  plannedEncodedPolyline?: string | null;
  deviceCode?: string | null;
  onPointSelect?: (point: TTrackingPoint, distanceMeters?: number | null) => void;
};

const GOONG_SCRIPT_ID = "goong-gl-js-script";
const GOONG_CSS_ID = "goong-gl-js-style";
const GOONG_SCRIPT_URL =
  "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.js";
const GOONG_CSS_URL =
  "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js/dist/goong-js.css";
const GOONG_STYLE_URL = "https://tiles.goong.io/assets/goong_map_web.json";

const loadGoongScript = () =>
  new Promise<any>((resolve, reject) => {
    if (window.goongjs) {
      resolve(window.goongjs);
      return;
    }

    if (!document.getElementById(GOONG_CSS_ID)) {
      const link = document.createElement("link");
      link.id = GOONG_CSS_ID;
      link.rel = "stylesheet";
      link.href = GOONG_CSS_URL;
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById(
      GOONG_SCRIPT_ID
    ) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.goongjs));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.id = GOONG_SCRIPT_ID;
    script.src = GOONG_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.goongjs);
    script.onerror = reject;
    document.body.appendChild(script);
  });

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildPopupHtml = (
  point: TTrackingPoint,
  deviceCode?: string | null,
  distanceMeters?: number | null
) => `
  <div style="min-width: 210px; font-family: Inter, system-ui, sans-serif;">
    <div style="font-weight: 700; margin-bottom: 8px;">Điểm telemetry</div>
    <div style="font-size: 13px; line-height: 1.65;">
      <div><b>Nhiệt độ:</b> ${escapeHtml(formatTemperature(point.tempC))}</div>
      <div><b>Thời gian:</b> ${escapeHtml(formatTrackingDateTime(point.timestamp))}</div>
      <div><b>Vĩ độ:</b> ${escapeHtml(formatCoordinate(point.lat))}</div>
      <div><b>Kinh độ:</b> ${escapeHtml(formatCoordinate(point.lon))}</div>
      <div><b>Thiết bị:</b> ${escapeHtml(deviceCode || "N/A")}</div>
      ${
        distanceMeters != null
          ? `<div style="color:#64748b;"><b>Gần điểm bấm:</b> ${Math.round(
              distanceMeters
            )} m</div>`
          : ""
      }
    </div>
  </div>
`;

const setGeoJsonSource = (map: any, sourceId: string, data: unknown) => {
  const source = map.getSource(sourceId);
  if (source) {
    source.setData(data);
    return;
  }

  map.addSource(sourceId, {
    type: "geojson",
    data,
  });
};

const TrackingMap = ({
  points,
  latestPoint,
  actualEncodedPolyline,
  plannedEncodedPolyline,
  deviceCode,
  onPointSelect,
}: Props) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const popupRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  const maptilesKey = envConfig.VITE_GOONG_MAPTILES_KEY;
  const actualCoordinates = useMemo(() => {
    const decoded = decodePolyline(actualEncodedPolyline);
    return decoded.length >= 2 ? decoded : pointsToCoordinates(points);
  }, [actualEncodedPolyline, points]);
  const plannedCoordinates = useMemo(
    () => decodePolyline(plannedEncodedPolyline),
    [plannedEncodedPolyline]
  );
  const lastPoint = points.length > 0 ? points[points.length - 1] : null;
  const currentPoint = latestPoint ?? lastPoint;

  useEffect(() => {
    if (!maptilesKey || !mapContainerRef.current || mapRef.current) return;

    let cancelled = false;

    loadGoongScript()
      .then((goongjs) => {
        if (cancelled || !mapContainerRef.current) return;

        goongjs.accessToken = maptilesKey;
        const firstCoordinate =
          actualCoordinates[0] ??
          (currentPoint
            ? [currentPoint.lon, currentPoint.lat]
            : [106.700981, 10.776889]);

        mapRef.current = new goongjs.Map({
          container: mapContainerRef.current,
          style: GOONG_STYLE_URL,
          center: firstCoordinate,
          zoom: 11,
        });

        mapRef.current.addControl(new goongjs.NavigationControl(), "top-right");
        mapRef.current.on("load", () => setMapReady(true));
      })
      .catch(() => setScriptError(true));

    return () => {
      cancelled = true;
    };
  }, [actualCoordinates, currentPoint, maptilesKey]);

  useEffect(() => {
    const map = mapRef.current;
    const goongjs = window.goongjs;
    if (!map || !mapReady || !goongjs) return;

    const plannedData = buildLineFeature(plannedCoordinates);
    setGeoJsonSource(map, "planned-route", plannedData);
    if (!map.getLayer("planned-route-line")) {
      map.addLayer({
        id: "planned-route-line",
        type: "line",
        source: "planned-route",
        paint: {
          "line-color": "#94a3b8",
          "line-width": 3,
          "line-dasharray": [2, 2],
        },
      });
    }

    const actualData = buildLineFeature(actualCoordinates);
    setGeoJsonSource(map, "actual-route", actualData);
    if (!map.getLayer("actual-route-line")) {
      map.addLayer({
        id: "actual-route-line",
        type: "line",
        source: "actual-route",
        paint: {
          "line-color": "#2563eb",
          "line-width": 5,
          "line-opacity": 0.9,
        },
      });
    }

    setGeoJsonSource(map, "telemetry-points", buildPointFeatureCollection(points));
    if (!map.getLayer("telemetry-points-circle")) {
      map.addLayer({
        id: "telemetry-points-circle",
        type: "circle",
        source: "telemetry-points",
        paint: {
          "circle-radius": 5,
          "circle-color": [
            "case",
            [">=", ["get", "tempC"], 8],
            "#dc2626",
            [">=", ["get", "tempC"], 6],
            "#f59e0b",
            "#10b981",
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });
    }

    const currentData = buildPointFeatureCollection(currentPoint ? [currentPoint] : []);
    setGeoJsonSource(map, "current-position", currentData);
    if (!map.getLayer("current-position-circle")) {
      map.addLayer({
        id: "current-position-circle",
        type: "circle",
        source: "current-position",
        paint: {
          "circle-radius": 9,
          "circle-color": "#1d4ed8",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 3,
        },
      });
    }

    const fitCoordinates = [
      ...plannedCoordinates,
      ...actualCoordinates,
      ...(currentPoint ? [[currentPoint.lon, currentPoint.lat] as [number, number]] : []),
    ];

    if (fitCoordinates.length > 0) {
      const bounds = new goongjs.LngLatBounds();
      fitCoordinates.forEach((coordinate) => bounds.extend(coordinate));
      map.fitBounds(bounds, {
        padding: 60,
        maxZoom: 14,
        duration: 600,
      });
    }
  }, [actualCoordinates, currentPoint, mapReady, plannedCoordinates, points]);

  useEffect(() => {
    const map = mapRef.current;
    const goongjs = window.goongjs;
    if (!map || !mapReady || !goongjs) return;

    const openPopup = (
      point: TTrackingPoint,
      distanceMeters?: number | null
    ) => {
      popupRef.current?.remove();
      popupRef.current = new goongjs.Popup({ closeButton: true })
        .setLngLat([point.lon, point.lat])
        .setHTML(buildPopupHtml(point, deviceCode, distanceMeters))
        .addTo(map);
      onPointSelect?.(point, distanceMeters);
    };

    const handleClick = (event: any) => {
      const feature = map.queryRenderedFeatures(event.point, {
        layers: ["telemetry-points-circle", "current-position-circle"],
      })?.[0];

      if (feature?.layer?.id === "current-position-circle" && currentPoint) {
        openPopup(currentPoint, null);
        return;
      }

      if (feature?.properties?.index != null) {
        const point = points[Number(feature.properties.index)];
        if (point) {
          openPopup(point, null);
          return;
        }
      }

      const nearest = findNearestTrackingPoint(
        event.lngLat.lng,
        event.lngLat.lat,
        points
      );
      if (nearest && nearest.distance <= 600) {
        openPopup(nearest.point, nearest.distance);
      }
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [currentPoint, deviceCode, mapReady, onPointSelect, points]);

  useEffect(() => {
    return () => {
      popupRef.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <Card className="rounded-lg py-0">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPinned className="h-4 w-4 text-blue-700" />
          Bản đồ hành trình
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!maptilesKey && (
          <div className="flex h-[560px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <MapPinned className="h-9 w-9 text-muted-foreground" />
            <p className="mt-3 font-medium">Thiếu Goong Maptiles Key</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Thêm `VITE_GOONG_MAPTILES_KEY` vào file `.env` để hiển thị bản đồ.
            </p>
          </div>
        )}

        {maptilesKey && scriptError && (
          <div className="flex h-[560px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
            <MapPinned className="h-9 w-9 text-muted-foreground" />
            <p className="mt-3 font-medium">Không tải được Goong GL JS</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Kiểm tra mạng hoặc CDN Goong trước khi mở lại màn này.
            </p>
          </div>
        )}

        {maptilesKey && !scriptError && (
          <div className="relative overflow-hidden rounded-lg border">
            <div ref={mapContainerRef} className="h-[560px] w-full" />
            {!mapReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 text-sm text-muted-foreground">
                Đang tải bản đồ...
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackingMap;
