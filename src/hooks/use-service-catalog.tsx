import { serviceCatalogApi } from "@/apis/service-catalog.api";
import type {
  TServiceCatalogCreateRequest,
  TServiceCatalogUpdateRequest,
} from "@/schemas/service-catalog.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useServiceCatalog = () => {
  const queryClient = useQueryClient();

  const getServiceCatalogs = () =>
    useQuery({
      queryKey: ["service-catalogs"],
      queryFn: serviceCatalogApi.getServiceCatalogs,
    });

  const getActiveServiceCatalogs = () =>
    useQuery({
      queryKey: ["service-catalogs", "active"],
      queryFn: serviceCatalogApi.getActiveServiceCatalogs,
    });

  const getServiceCatalogById = (id?: string) =>
    useQuery({
      queryKey: ["service-catalog", id],
      queryFn: () => serviceCatalogApi.getServiceCatalogById(id!),
      enabled: !!id,
    });

  const createServiceCatalog = useMutation({
    mutationFn: (data: TServiceCatalogCreateRequest) =>
      serviceCatalogApi.createServiceCatalog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-catalogs"] });
    },
  });

  const updateServiceCatalog = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TServiceCatalogUpdateRequest;
    }) => serviceCatalogApi.updateServiceCatalog(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["service-catalogs"] });
      queryClient.invalidateQueries({ queryKey: ["service-catalog", id] });
    },
  });

  const deleteServiceCatalog = useMutation({
    mutationFn: (id: string) => serviceCatalogApi.deleteServiceCatalog(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["service-catalogs"] });
      queryClient.invalidateQueries({ queryKey: ["service-catalog", id] });
    },
  });

  return {
    getServiceCatalogs,
    getActiveServiceCatalogs,
    getServiceCatalogById,
    createServiceCatalog,
    updateServiceCatalog,
    deleteServiceCatalog,
  };
};
