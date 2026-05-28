const API_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

export async function saveJob(jobId) {
  const res = await fetch(`${API_URL}/saved-jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ jobId }),
  });

  return res.json();
}

export async function getSavedJobs() {
  const res = await fetch(`${API_URL}/saved-jobs`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
}

export async function unsaveJob(savedJobId) {
  const res = await fetch(`${API_URL}/saved-jobs/${savedJobId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
}