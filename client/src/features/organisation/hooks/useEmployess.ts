import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import * as api from "../services/organizationApi";

export const useEmployees = () =>
  useQuery({
    queryKey: ["employees"],
    queryFn: api.getEmployees,
  });

export const useUpdateEmployee = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: any;
    }) => api.updateEmployee(id, payload),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};

export const useEmployeeRole = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      role,
    }: {
      id: string;
      role: string;
    }) => api.updateEmployeeRole(id, role),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};

export const useEmployeeStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => api.updateEmployeeStatus(id, status),

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
};