export const normalizeParams = (filters: any) => {
  const normalized = { ...filters };
  const sort = filters.sort?.split(",");

  if (Array.isArray(sort) && sort.length) {
    normalized.sortBy = sort[0];
    normalized.sortDirection = sort[1];
  }

  const removeEmptyValueParams = Object.fromEntries(
    Object.entries(normalized).filter(([_, v]) => v != null)
  );
  return removeEmptyValueParams;
};


export const API_SUFFIX = {
  // Auth
  AUTH_API: "/auth",
  // Users
  USERS_API: "/v1/users",
  // Warehouses
  WAREHOUSES_API: "/v1/warehouses",
  // Orders
  ORDERS_API: "/orders",
  // Quotations
  QUOTATIONS_API: "/quotations",
  // Contracts
  CONTRACTS_API: "/contracts",
  CONTRACT_APPENDICES_API: "/contracts/appendices",
  // Discrepancy
  DISCREPANCY_API: "/Discrepancy",
  // Dispatch
  DISPATCH_API: "/Dispatch",
  OUTBOUND_API: "/Outbound",
  // Vehicles
  VEHICLES_API: "/vehicles",
  VEHICLE_DOCUMENTS_API: "/vehicle-documents",
  MAINTENANCE_TICKETS_API: "/maintenance-tickets",
  // IoT Devices
  IOT_DEVICES_API: "/iot-devices",
  // Drivers
  DRIVERS_API: "/drivers",
  DRIVER_LICENSES_API: "/driver-licenses",
  // Routes
  ROUTES_API: "/routes",
  WEIGHT_TIERS_API: "/weight-tiers",
  // Service pricing
  SERVICE_CATALOGS_API: "/service-catalogs",
  IMPORT_TEMPLATES_API: "/import-templates",
};
