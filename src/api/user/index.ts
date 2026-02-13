import { useMutation } from "@tanstack/react-query";
import useGetRequest from "../hooks/useGetRequest";
import usePutRequest from "../hooks/usePutRequest";
import useDeleteRequest from "../hooks/useDeleteRequest";
import axiosInstance from "../../lib/axiosInstance";
import { GetAllUsersPaginated, UpdateUserBody } from "./types";

export const useGetAllUsers = (params?: Record<string, any>) =>
  useGetRequest<GetAllUsersPaginated>(`/users`, params);

type TUseUpdateUser = {
  id: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
};

type TUseDeleteUser = {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
};

type TUseToggleUserStatus = {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
};

export const useUpdateUser = ({ id, onSuccess, onError }: TUseUpdateUser) =>
  usePutRequest<UpdateUserBody>(`/users/${id}`, { onSuccess, onError });

export const useToggleUserStatus = ({ onSuccess, onError }: TUseToggleUserStatus) =>
  useMutation({
    mutationFn: (userId: string) =>
      axiosInstance.patch(`/users/${userId}/status`, {}).then((res) => res.data),
    onSuccess,
    onError,
  });

export const useDeleteUser = ({ onSuccess, onError }: TUseDeleteUser) =>
  useDeleteRequest(`/users`, { onSuccess, onError });
