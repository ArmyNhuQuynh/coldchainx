import { driverApi } from "@/apis/driver.api";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

export const useDriver = () => {
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

  return {
    getDrivers,
    getDriverById,
  };
};
