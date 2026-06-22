import { apiRequest } from "@/lib/http";
import type {
  TContractDraft,
  TContractInfo,
  TUpdateContractDraft,
} from "@/schemas/contract.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

const getContractById = async (contractId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TContractInfo>>(
    `${API_SUFFIX.CONTRACTS_API}/${contractId}`
  );
  return response.data;
};

const getContractByOrderId = async (orderId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TContractInfo>>(
    `${API_SUFFIX.CONTRACTS_API}/by-order/${orderId}`
  );
  return response.data;
};

const getContractHtml = async (contractId: string) => {
  const response = await apiRequest.baseApi.get<string>(
    `${API_SUFFIX.CONTRACTS_API}/${contractId}/html`,
    { responseType: "text" }
  );
  return response.data;
};

const previewContract = async (orderId: string) => {
  const response = await apiRequest.baseApi.get<string>(
    `${API_SUFFIX.CONTRACTS_API}/preview/${orderId}`,
    { responseType: "text" }
  );
  return response.data;
};

const updateContractDraft = async (
  contractId: string,
  data: TUpdateContractDraft
) => {
  const response = await apiRequest.baseApi.put<BaseResponse<TContractDraft>>(
    `${API_SUFFIX.CONTRACTS_API}/${contractId}`,
    data.editedHtmlContent,
    {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
      },
    }
  );
  return response.data;
};

const sendContract = async (contractId: string) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TContractInfo>>(
    `${API_SUFFIX.CONTRACTS_API}/${contractId}/send`
  );
  return response.data;
};

const verifyContract = async (contractId: string) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TContractInfo>>(
    `${API_SUFFIX.CONTRACTS_API}/${contractId}/verify`
  );
  return response.data;
};

export const contractApi = {
  getContractById,
  getContractByOrderId,
  getContractHtml,
  previewContract,
  updateContractDraft,
  sendContract,
  verifyContract,
};
