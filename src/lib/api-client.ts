// src/lib/api-client.ts

import api from "./axios";

export const apiClient = {
  get: async <T>(url: string, config = {}) => {
    const res = await api.get<T>(url, config);
    return res.data;
  },

  post: async <T>(url: string, data?: unknown, config = {}) => {
    const res = await api.post<T>(url, data, config);
    return res.data;
  },

  put: async <T>(url: string, data?: unknown, config = {}) => {
    const res = await api.put<T>(url, data, config);
    return res.data;
  },

  patch: async <T>(url: string, data?: unknown, config = {}) => {
    const res = await api.patch<T>(url, data, config);
    return res.data;
  },

  delete: async <T>(url: string, config = {}) => {
    const res = await api.delete<T>(url, config);
    return res.data;
  },
};
