import { weightTierApi } from "@/apis/weight-tier.api";
import type {
  TWeightTierListParams,
  TWeightTierRequest,
} from "@/schemas/weight-tier.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useWeightTier = () => {
  const queryClient = useQueryClient();

  const getWeightTiers = (params: TWeightTierListParams) =>
    useQuery({
      queryKey: ["weight-tiers", "list", params],
      queryFn: () => weightTierApi.getWeightTiers(params),
      placeholderData: keepPreviousData,
    });

  const getWeightTierById = (id?: string) =>
    useQuery({
      queryKey: ["weight-tier", id],
      queryFn: () => weightTierApi.getWeightTierById(id!),
      enabled: !!id,
    });

  const getWeightTiersByRoute = (routeId?: string) =>
    useQuery({
      queryKey: ["route", routeId, "weight-tiers"],
      queryFn: () => weightTierApi.getWeightTiersByRoute(routeId!),
      enabled: !!routeId,
    });

  const createWeightTier = useMutation({
    mutationFn: (data: TWeightTierRequest) =>
      weightTierApi.createWeightTier(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({
        queryKey: ["route", data.routeId, "weight-tiers"],
      });
      queryClient.invalidateQueries({ queryKey: ["weight-tiers"] });
    },
  });

  const updateWeightTier = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TWeightTierRequest;
    }) => weightTierApi.updateWeightTier(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({
        queryKey: ["route", data.routeId, "weight-tiers"],
      });
      queryClient.invalidateQueries({ queryKey: ["weight-tier", id] });
      queryClient.invalidateQueries({ queryKey: ["weight-tiers"] });
    },
  });

  const deleteWeightTier = useMutation({
    mutationFn: ({ id }: { id: string; routeId: string }) =>
      weightTierApi.deleteWeightTier(id),
    onSuccess: (_, { id, routeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["route", routeId, "weight-tiers"],
      });
      queryClient.invalidateQueries({ queryKey: ["weight-tier", id] });
      queryClient.invalidateQueries({ queryKey: ["weight-tiers"] });
    },
  });

  return {
    getWeightTiers,
    getWeightTierById,
    getWeightTiersByRoute,
    createWeightTier,
    updateWeightTier,
    deleteWeightTier,
  };
};
