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
