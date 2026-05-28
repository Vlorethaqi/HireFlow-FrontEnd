import { authFetch } from "./authFetch";

export async function createJob(data) {
  const res = await authFetch("/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function getJobs(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== "")
  );
  const res = await authFetch(`/jobs${query.toString() ? `?${query}` : ""}`);

  return res.json();
}
