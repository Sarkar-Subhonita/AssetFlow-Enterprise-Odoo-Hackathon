import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import * as api from "../services/organizationApi";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: api.createCategory,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: any;
    }) => api.updateCategory(id, payload),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};

export const useCategoryStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => api.changeCategoryStatus(id, status),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
};