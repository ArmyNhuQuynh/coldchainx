import { apiRequest } from "@/lib/http";
import type {
  TChatMessage,
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
  getParticipants,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
};
