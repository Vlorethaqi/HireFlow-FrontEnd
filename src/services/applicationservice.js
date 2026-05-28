const API_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  };
}

export async function applyToJob(data) {
  const res = await fetch(`${API_URL}/applications/apply`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function getMyApplications() {
  const res = await fetch(`${API_URL}/applications/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
}

export async function getCompanyApplications() {
  const res = await fetch(`${API_URL}/applications/company`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
}

export async function updateApplicationStatus(id, statusId) {
  const res = await fetch(`${API_URL}/applications/${id}/status`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ statusId })
  });

  return res.json();
}

export async function createApplicationReview(data) {
  const res = await fetch(`${API_URL}/application-reviews`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function createApplicationResponse(data) {
  const res = await fetch(`${API_URL}/application-responses`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function analyzeApplication(applicationId) {
  const res = await fetch(`${API_URL}/ai/analyze-application/${applicationId}`, {
    method: "POST",
    headers: headers()
  });

  return res.json();
}