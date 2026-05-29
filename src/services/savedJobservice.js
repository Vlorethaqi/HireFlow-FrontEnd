import api from "./api";

// SAVE JOB
export async function saveJob(jobId) {
  const res = await api.post("/saved-jobs", { jobId });
  return res.data;
}

// GET SAVED JOBS
export async function getSavedJobs() {
  const res = await api.get("/saved-jobs");
  return res.data;
}

// UNSAVE JOB
export async function unsaveJob(savedJobId) {
  const res = await api.delete(`/saved-jobs/${savedJobId}`);
  return res.data;
}