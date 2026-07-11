import type { TTrackingPoint } from "@/schemas/monitoring.schema";

export type MapCoordinate = [number, number];

export const decodePolyline = (encoded?: string | null): MapCoordinate[] => {
  if (!encoded) return [];

  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates: MapCoordinate[] = [];

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);

    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20 && index < encoded.length);

    lng += result & 1 ? ~(result >> 1) : result >> 1;
    coordinates.push([lng / 1e5, lat / 1e5]);
  }

  return coordinates;
};

export const pointsToCoordinates = (points: TTrackingPoint[]): MapCoordinate[] =>
  points
    .filter(
      (point) =>
        Number.isFinite(point.lat) &&
        Number.isFinite(point.lon) &&
        point.lat !== 0 &&
        point.lon !== 0
    )
    .map((point) => [point.lon, point.lat]);

const toRadians = (value: number) => (value * Math.PI) / 180;

export const distanceMeters = (
  lonA: number,
  latA: number,
  lonB: number,
  latB: number
) => {
  const earthRadiusMeters = 6371000;
  const dLat = toRadians(latB - latA);
  const dLon = toRadians(lonB - lonA);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(latA)) *
      Math.cos(toRadians(latB)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const findNearestTrackingPoint = (
  lon: number,
  lat: number,
  points: TTrackingPoint[]
) => {
  if (points.length === 0) return null;

  return points.reduce<{
    point: TTrackingPoint;
    distance: number;
  } | null>((nearest, point) => {
    const distance = distanceMeters(lon, lat, point.lon, point.lat);
    if (!nearest || distance < nearest.distance) {
      return { point, distance };
    }

    return nearest;
  }, null);
};

export const buildLineFeature = (coordinates: MapCoordinate[]) => ({
  type: "FeatureCollection",
  features:
    coordinates.length >= 2
      ? [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates,
            },
          },
        ]
      : [],
});

export const buildPointFeatureCollection = (points: TTrackingPoint[]) => ({
  type: "FeatureCollection",
  features: points.map((point, index) => ({
    type: "Feature",
    properties: {
      index,
      tempC: point.tempC,
      timestamp: point.timestamp,
    },
    geometry: {
      type: "Point",
      coordinates: [point.lon, point.lat],
    },
  })),
});
