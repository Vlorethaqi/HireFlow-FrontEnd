import api from "./api";

// CREATE COMPANY + ADMIN
export async function createCompany(data) {
  const res = await api.post("/companies", data);
  return res.data;
}

// GET MY COMPANY
export async function getMyCompany() {
  const res = await api.get("/companies/me");
  return res.data;
}

// UPDATE COMPANY
export async function updateCompany(id, data) {
  const res = await api.put(`/companies/${id}`, data);
  return res.data;
}