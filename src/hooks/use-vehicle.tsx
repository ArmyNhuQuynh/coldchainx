import { vehicleApi } from "@/apis/vehicle.api";
import type {
  TCompleteMaintenanceTicketRequest,
  TCreateMaintenanceTicketRequest,
  TMaintenanceTicketQuery,
  TVehicleCreateRequest,
  TVehicleDocumentRequest,
  TVehicleUpdateRequest,
} from "@/schemas/vehicle.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useVehicle = () => {
  const queryClient = useQueryClient();

  const invalidateVehicleQueries = (vehicleId?: string | null) => {
    if (vehicleId) {
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
      queryClient.invalidateQueries({
        queryKey: ["vehicle-documents", vehicleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicle-maintenance-history", vehicleId],
      });
      queryClient.invalidateQueries({
        queryKey: ["vehicle-maintenance-forecast", vehicleId],
      });
    }

    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
  };

  const getVehicles = () => {
    return useQuery({
      queryKey: ["vehicles"],
      queryFn: vehicleApi.getVehicles,
      placeholderData: keepPreviousData,
    });
  };

  const getVehicleById = (id?: string) => {
    return useQuery({
      queryKey: ["vehicle", id],
      queryFn: () => vehicleApi.getVehicleById(id!),
      enabled: !!id,
    });
  };

  const createVehicle = useMutation({
    mutationFn: (data: TVehicleCreateRequest) => vehicleApi.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const updateVehicle = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TVehicleUpdateRequest;
    }) => vehicleApi.updateVehicle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", id] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const deleteVehicle = useMutation({
    mutationFn: (id: string) => vehicleApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const importVehicles = useMutation({
    mutationFn: (file: File) => vehicleApi.importVehicles(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const getVehicleDocuments = (vehicleId?: string) => {
    return useQuery({
      queryKey: ["vehicle-documents", vehicleId],
      queryFn: () => vehicleApi.getVehicleDocuments(vehicleId),
      enabled: !!vehicleId,
      placeholderData: keepPreviousData,
    });
  };

  const createVehicleDocument = useMutation({
    mutationFn: ({
      vehicleId,
      data,
    }: {
      vehicleId: string;
      data: TVehicleDocumentRequest;
    }) => vehicleApi.createVehicleDocument(vehicleId, data),
    onSuccess: (_, { vehicleId }) => {
      invalidateVehicleQueries(vehicleId);
    },
  });

  const updateVehicleDocument = useMutation({
    mutationFn: ({
      docId,
      data,
    }: {
      docId: string;
      data: TVehicleDocumentRequest;
      vehicleId?: string | null;
    }) => vehicleApi.updateVehicleDocument(docId, data),
    onSuccess: (response, variables) => {
      invalidateVehicleQueries(response.data?.vehicleId ?? variables.vehicleId);
    },
  });

  const deleteVehicleDocument = useMutation({
    mutationFn: ({
      docId,
    }: {
      docId: string;
      vehicleId?: string | null;
    }) => vehicleApi.deleteVehicleDocument(docId),
    onSuccess: (_, variables) => {
      invalidateVehicleQueries(variables.vehicleId);
    },
  });

  const importVehicleDocuments = useMutation({
    mutationFn: (file: File) => vehicleApi.importVehicleDocuments(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-documents"] });
    },
  });

  const getMaintenanceTickets = (params: TMaintenanceTicketQuery = {}) => {
    return useQuery({
      queryKey: ["maintenance-tickets", params],
      queryFn: () => vehicleApi.getMaintenanceTickets(params),
      placeholderData: keepPreviousData,
    });
  };

  const getMaintenanceTicketById = (id?: string) => {
    return useQuery({
      queryKey: ["maintenance-ticket", id],
      queryFn: () => vehicleApi.getMaintenanceTicketById(id!),
      enabled: !!id,
    });
  };

  const createMaintenanceTicket = useMutation({
    mutationFn: ({
      vehicleId,
      data,
    }: {
      vehicleId: string;
      data: TCreateMaintenanceTicketRequest;
    }) => vehicleApi.createMaintenanceTicket(vehicleId, data),
    onSuccess: (_, { vehicleId }) => {
      invalidateVehicleQueries(vehicleId);
    },
  });

  const updateMaintenanceTicketStatus = useMutation({
    mutationFn: ({
      ticketId,
      status,
    }: {
      ticketId: string;
      status: string;
      vehicleId?: string | null;
    }) => vehicleApi.updateMaintenanceTicketStatus(ticketId, status),
    onSuccess: (response, variables) => {
      invalidateVehicleQueries(response.data?.vehicleId ?? variables.vehicleId);
      queryClient.invalidateQueries({
        queryKey: ["maintenance-ticket", variables.ticketId],
      });
    },
  });

  const completeMaintenanceTicket = useMutation({
    mutationFn: ({
      ticketId,
      data,
    }: {
      ticketId: string;
      data: TCompleteMaintenanceTicketRequest;
      vehicleId?: string | null;
    }) => vehicleApi.completeMaintenanceTicket(ticketId, data),
    onSuccess: (response, variables) => {
      invalidateVehicleQueries(response.data?.vehicleId ?? variables.vehicleId);
      queryClient.invalidateQueries({
        queryKey: ["maintenance-ticket", variables.ticketId],
      });
    },
  });

  const uploadMaintenanceTicketDocument = useMutation({
    mutationFn: ({
      ticketId,
      file,
    }: {
      ticketId: string;
      file: File;
      vehicleId?: string | null;
    }) => vehicleApi.uploadMaintenanceTicketDocument(ticketId, file),
    onSuccess: (_, variables) => {
      invalidateVehicleQueries(variables.vehicleId);
      queryClient.invalidateQueries({
        queryKey: ["maintenance-ticket", variables.ticketId],
      });
    },
  });

  const getVehicleMaintenanceHistory = (vehicleId?: string) => {
    return useQuery({
      queryKey: ["vehicle-maintenance-history", vehicleId],
      queryFn: () => vehicleApi.getVehicleMaintenanceHistory(vehicleId!),
      enabled: !!vehicleId,
      placeholderData: keepPreviousData,
    });
  };

  const getVehicleMaintenanceForecast = (vehicleId?: string, tripId?: string) => {
    return useQuery({
      queryKey: ["vehicle-maintenance-forecast", vehicleId, tripId],
      queryFn: () => vehicleApi.getVehicleMaintenanceForecast(vehicleId!, tripId),
      enabled: !!vehicleId,
      placeholderData: keepPreviousData,
    });
  };

  const markVehicleUnavailable = useMutation({
    mutationFn: ({
      vehicleId,
      reason,
    }: {
      vehicleId: string;
      reason?: string;
    }) => vehicleApi.markVehicleUnavailable(vehicleId, reason),
    onSuccess: (_, { vehicleId }) => {
      invalidateVehicleQueries(vehicleId);
    },
  });

  return {
    getVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    importVehicles,
    getVehicleDocuments,
    createVehicleDocument,
    updateVehicleDocument,
    deleteVehicleDocument,
    importVehicleDocuments,
    getMaintenanceTickets,
    getMaintenanceTicketById,
    createMaintenanceTicket,
    updateMaintenanceTicketStatus,
    completeMaintenanceTicket,
    uploadMaintenanceTicketDocument,
    getVehicleMaintenanceHistory,
    getVehicleMaintenanceForecast,
    markVehicleUnavailable,
  };
};
