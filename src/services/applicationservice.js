import { authFetch } from "./authFetch";

function headers() {
  return {
    "Content-Type": "application/json"
  };
}

export async function applyToJob(data) {
  const res = await authFetch("/applications/apply", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function getMyApplications() {
  const res = await authFetch("/applications/me");

  return res.json();
}

export async function getCompanyApplications() {
  const res = await authFetch("/applications/company");

  return res.json();
}

export async function updateApplicationStatus(id, statusId) {
  const res = await authFetch(`/applications/${id}/status`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ statusId })
  });

  return res.json();
}

export async function getApplicationStatuses() {
  const res = await authFetch("/application-statuses");

  return res.json();
}

export async function createApplicationReview(data) {
  const res = await authFetch("/application-reviews", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function createApplicationResponse(data) {
  const res = await authFetch("/application-responses", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function analyzeApplication(applicationId) {
  const res = await authFetch(`/ai/analyze-application/${applicationId}`, {
    method: "POST",
    headers: headers()
  });

  return res.json();
}
