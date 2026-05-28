const API_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

export async function getMyProfile() {
  const res = await fetch(`${API_URL}/candidate-profiles/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
}

export async function saveMyProfile(data) {
  const res = await fetch(`${API_URL}/candidate-profiles/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
}