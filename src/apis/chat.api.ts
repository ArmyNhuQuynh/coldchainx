import { apiRequest } from "@/lib/http";
import type {
  TChatMessage,
  TChatCustomerSummary,
  TChatParticipant,
  TChatUnreadCount,
  TMarkChatMessagesRead,
  TSendChatMessage,
} from "@/schemas/chat.schema";
import type { BaseResponse, PaginationResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

type ChatMessageQuery = {
  pageNumber?: number;
  pageSize?: number;
};

type ChatCustomerQuery = ChatMessageQuery & {
  search?: string;
};

const getMessages = async (orderId: string, params?: ChatMessageQuery) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<PaginationResponse<TChatMessage>>
  >(`${API_SUFFIX.CHAT_API}/${orderId}/messages`, { params });

  return response.data;
};

const getParticipants = async (orderId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TChatParticipant>>(
    `${API_SUFFIX.CHAT_API}/${orderId}/participants`
  );

  return response.data;
};

const getCustomerConversations = async (params?: ChatCustomerQuery) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<PaginationResponse<TChatCustomerSummary>>
  >(`${API_SUFFIX.CHAT_API}/customers`, { params });

  return response.data;
};

const getCustomerMessages = async (
  customerId: string,
  params?: ChatMessageQuery
) => {
  const response = await apiRequest.baseApi.get<
    BaseResponse<PaginationResponse<TChatMessage>>
  >(`${API_SUFFIX.CHAT_API}/customers/${customerId}/messages`, { params });

  return response.data;
};

const sendMessage = async (orderId: string, data: TSendChatMessage) => {
  const response = await apiRequest.baseApi.post<BaseResponse<TChatMessage>>(
    `${API_SUFFIX.CHAT_API}/${orderId}/messages`,
    data
  );

  return response.data;
};

const markMessagesAsRead = async (orderId: string) => {
  const response = await apiRequest.baseApi.patch<
    BaseResponse<TMarkChatMessagesRead>
  >(`${API_SUFFIX.CHAT_API}/${orderId}/messages/read`);

  return response.data;
};

const getUnreadCount = async (orderId: string) => {
  const response = await apiRequest.baseApi.get<BaseResponse<TChatUnreadCount>>(
    `${API_SUFFIX.CHAT_API}/${orderId}/unread-count`
  );

  return response.data;
};

export const chatApi = {
  getMessages,
  getCustomerConversations,
  getCustomerMessages,
  getParticipants,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
};
