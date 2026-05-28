import { authFetch } from "./authFetch";

export async function getMyProfile() {
  const res = await authFetch("/candidate-profiles/me");

  return res.json();
}

export async function saveMyProfile(data) {
  const res = await authFetch("/candidate-profiles/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}
