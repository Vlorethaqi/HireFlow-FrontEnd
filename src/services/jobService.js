const API_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

export async function createJob(data) {
  const res = await fetch(`${API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

export async function getJobs(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== "")
  );
  const res = await fetch(`${API_URL}/jobs${query.toString() ? `?${query}` : ""}`);

  return res.json();
}
