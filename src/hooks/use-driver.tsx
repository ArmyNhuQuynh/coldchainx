import { driverApi } from "@/apis/driver.api";
import type {
  TDriverCreateRequest,
  TDriverLicenseRequest,
  TDriverUpdateRequest,
} from "@/schemas/driver.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useDriver = () => {
  const queryClient = useQueryClient();

  const getDrivers = () => {
    return useQuery({
      queryKey: ["drivers"],
      queryFn: driverApi.getDrivers,
      placeholderData: keepPreviousData,
    });
  };

  const getDriverById = (id?: string) => {
    return useQuery({
      queryKey: ["driver", id],
      queryFn: () => driverApi.getDriverById(id!),
      enabled: !!id,
    });
  };

  const getDriverLicenses = (driverId?: string) => {
    return useQuery({
      queryKey: ["driver-licenses", driverId],
      queryFn: () => driverApi.getDriverLicenses(driverId),
      placeholderData: keepPreviousData,
    });
  };

  const createDriver = useMutation({
    mutationFn: (data: TDriverCreateRequest) => driverApi.createDriver(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });

  const updateDriver = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TDriverUpdateRequest }) =>
      driverApi.updateDriver(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["driver", id] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });

  const deleteDriver = useMutation({
    mutationFn: (id: string) => driverApi.deleteDriver(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });

  const importDrivers = useMutation({
    mutationFn: (file: File) => driverApi.importDrivers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });

  const createDriverLicense = useMutation({
    mutationFn: ({
      driverId,
      data,
    }: {
      driverId: string;
      data: TDriverLicenseRequest;
    }) => driverApi.createDriverLicense(driverId, data),
    onSuccess: (_, { driverId }) => {
      queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["driver-licenses", driverId] });
    },
  });

  const updateDriverLicense = useMutation({
    mutationFn: ({
      licenseId,
      data,
    }: {
      licenseId: string;
      data: TDriverLicenseRequest;
    }) => driverApi.updateDriverLicense(licenseId, data),
    onSuccess: (response) => {
      const driverId = response.data?.driverId ?? undefined;
      if (driverId) {
        queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
        queryClient.invalidateQueries({ queryKey: ["driver-licenses", driverId] });
      }
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });

  const deleteDriverLicense = useMutation({
    mutationFn: (payload: {
      licenseId: string;
      driverId?: string;
    }) => driverApi.deleteDriverLicense(payload.licenseId),
    onSuccess: (_, { driverId }) => {
      if (driverId) {
        queryClient.invalidateQueries({ queryKey: ["driver", driverId] });
        queryClient.invalidateQueries({ queryKey: ["driver-licenses", driverId] });
      }
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
    },
  });

  const importDriverLicenses = useMutation({
    mutationFn: (file: File) => driverApi.importDriverLicenses(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["driver-licenses"] });
    },
  });

  return {
    getDrivers,
    getDriverById,
    getDriverLicenses,
    createDriver,
    updateDriver,
    deleteDriver,
    importDrivers,
    createDriverLicense,
    updateDriverLicense,
    deleteDriverLicense,
    importDriverLicenses,
  };
};
