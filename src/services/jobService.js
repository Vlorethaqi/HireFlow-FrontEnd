import api from "./api";

export async function createJob(data) {
  const res = await api.post("/jobs", data);
  return res.data;
}

export async function getJobs(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== "")
  ).toString();

  const res = await api.get(`/jobs${query ? `?${query}` : ""}`);
  return res.data;
}