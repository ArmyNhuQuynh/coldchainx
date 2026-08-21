import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock("@/lib/http", () => ({
  apiRequest: {
    baseApi: {
      post: mocks.post,
    },
  },
}));

import { dispatchApi } from "./dispatch.api";

describe("dispatchApi.createTripFromWarehouse", () => {
  beforeEach(() => {
    mocks.post.mockReset();
  });

  it("gửi LPN qua query và chỉ gửi các field warehouse redispatch cho phép", async () => {
    mocks.post.mockResolvedValue({
      data: { success: true, data: { tripId: "trip-new" } },
    });

    const result = await dispatchApi.createTripFromWarehouse({
      lpnIds: ["lpn-1", "lpn-2"],
      vehicleId: "vehicle-1",
      driverIds: ["driver-1", "driver-2"],
      plannedStartTime: "2026-08-21T02:00:00.000Z",
      plannedEndTime: "2026-08-21T10:00:00.000Z",
    });

    expect(result).toEqual({ tripId: "trip-new" });
    expect(mocks.post).toHaveBeenCalledTimes(1);
    const [url, body, config] = mocks.post.mock.calls[0];

    expect(url).toBe("/Dispatch/create-trip-from-warehouse");
    expect(config).toEqual({ params: { lpnIds: ["lpn-1", "lpn-2"] } });
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("VehicleId")).toBe("vehicle-1");
    expect(body.getAll("DriverIds")).toEqual(["driver-1", "driver-2"]);
    expect(body.get("PlannedStartTime")).toBe("2026-08-21T02:00:00.000Z");
    expect(body.get("PlannedEndTime")).toBe("2026-08-21T10:00:00.000Z");
    expect(body.has("IncidentId")).toBe(false);
    expect(body.has("ScheduleId")).toBe(false);
    expect(body.has("WarehouseId")).toBe(false);
  });
});
