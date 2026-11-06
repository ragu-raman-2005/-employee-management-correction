
import api from "../services/api";

const departmentService = {
  getAll: async () => {
    const response = await api.get("/departments");
    return response.data;
  },

  create: async (department) => {
    const response = await api.post("/departments", department);
    return response.data;
  },

  update: async (id, department) => {
    const response = await api.put(`/departments/${id}`, department);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};

export default departmentService;
