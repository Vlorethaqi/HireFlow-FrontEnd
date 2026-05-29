import api from "./api";

export async function getMyProfile() {
  const res = await api.get("/candidate-profiles/me");
  return res.data;
}

export async function saveMyProfile(data) {
  const res = await api.put("/candidate-profiles/me", data);
  return res.data;
}