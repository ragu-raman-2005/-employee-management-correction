import api from "./api";

const onboardingService = {
  getAll: async () => {
    const response = await api.get("/onboarding");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/onboarding/${id}`);
    return response.data;
  },

  create: async (employee) => {
    const response = await api.post("/onboarding", employee);
    return response.data;
  },

  update: async (id, employee) => {
    const response = await api.put(`/onboarding/${id}`, employee);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/onboarding/${id}/status`, {
      status,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/onboarding/${id}`);
    return response.data;
  },
};

export default onboardingService;