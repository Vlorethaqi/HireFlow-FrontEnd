import api from "./api";

const headers = () => ({
  "Content-Type": "application/json",
});

// APPLY TO JOB
export async function applyToJob(data) {
  const res = await api.post("/applications/apply", data);
  return res.data;
}

// GET MY APPLICATIONS
export async function getMyApplications() {
  const res = await api.get("/applications/me");
  return res.data;
}

// COMPANY APPLICATIONS
export async function getCompanyApplications() {
  const res = await api.get("/applications/company");
  return res.data;
}

// UPDATE STATUS
export async function updateApplicationStatus(id, statusId) {
  const res = await api.put(`/applications/${id}/status`, { statusId });
  return res.data;
}

// STATUSES
export async function getApplicationStatuses() {
  const res = await api.get("/application-statuses");
  return res.data;
}

// REVIEW
export async function createApplicationReview(data) {
  const res = await api.post("/application-reviews", data);
  return res.data;
}

// RESPONSE
export async function createApplicationResponse(data) {
  const res = await api.post("/application-responses", data);
  return res.data;
}

// AI ANALYSIS
export async function analyzeApplication(applicationId) {
  const res = await api.post(`/ai/analyze-application/${applicationId}`);
  return res.data;
}