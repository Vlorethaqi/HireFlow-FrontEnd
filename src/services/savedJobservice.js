import { authFetch } from "./authFetch";

export async function saveJob(jobId) {
  const res = await authFetch("/saved-jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jobId }),
  });

  return res.json();
}

export async function getSavedJobs() {
  const res = await authFetch("/saved-jobs");

  return res.json();
}

export async function unsaveJob(savedJobId) {
  const res = await authFetch(`/saved-jobs/${savedJobId}`, {
    method: "DELETE",
  });

  return res.json();
}
