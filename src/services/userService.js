import api from "./api";

// GET USERS
export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

// CREATE USER
export async function createUser(data) {
  const res = await api.post("/users", data);
  return res.data;
}

// UPDATE USER
export async function updateUser(id, data) {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
}

// DELETE USER
export async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}