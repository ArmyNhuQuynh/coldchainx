import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  post: vi.fn(),
}));

vi.mock("@/lib/http", () => ({
  apiRequest: {
    baseApi: {
      get: vi.fn(),
      post: mocks.post,
    },
  },
}));

import { incidentApi } from "./incident.api";

describe("incidentApi.resolveIncident", () => {
  beforeEach(() => {
    mocks.post.mockReset();
  });

  it("gửi đúng endpoint, payload và trả data boolean", async () => {
    mocks.post.mockResolvedValue({
      data: {
        success: true,
        data: true,
        message: "Incident resolved successfully.",
      },
    });

    const result = await incidentApi.resolveIncident("incident-1", {
      resolutionNote: "Sự cố đã được xử lý và chuyến đã tiếp tục.",
    });

    expect(mocks.post).toHaveBeenCalledWith(
      "/v1/incidents/incident-1/resolve",
      {
        resolutionNote: "Sự cố đã được xử lý và chuyến đã tiếp tục.",
      },
    );
    expect(result).toBe(true);
  });
});

describe("incidentApi.inboundRouteWarehouse", () => {
  beforeEach(() => {
    mocks.post.mockReset();
  });

  it("gửi đúng seal tới endpoint inbound kho tuyến", async () => {
    const workflow = {
      incidentId: "incident-1",
      tripId: "trip-1",
      incidentStatus: "READY_FOR_REDISPATCH",
      tripStatus: "RELAY_COMPLETED",
      destinationWarehouseId: "warehouse-1",
      destinationWarehouseName: "Kho Hà Nội",
      externalVehiclePlate: "29C-12345",
      lpnCount: 4,
      warehouseInboundReady: false,
      requiredWarehouseAction: "CREATE_REDISPATCH_TRIP",
      message: "Cargo inbounded",
    };
    mocks.post.mockResolvedValue({
      data: { success: true, data: workflow },
    });

    const result = await incidentApi.inboundRouteWarehouse("incident-1", {
      sealNumber: "SEAL-01",
    });

    expect(mocks.post).toHaveBeenCalledWith(
      "/v1/incidents/incident-1/inbound-route-warehouse",
      { sealNumber: "SEAL-01" },
    );
    expect(result).toEqual(workflow);
  });
});
