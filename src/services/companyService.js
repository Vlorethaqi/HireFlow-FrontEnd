const API_URL = "http://localhost:3000";

function getToken() {
  return localStorage.getItem("token");
}

// CREATE COMPANY + ADMIN
export async function createCompany(data) {
  const res = await fetch(`${API_URL}/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

// GET MY COMPANY
export async function getMyCompany() {
  const res = await fetch(`${API_URL}/companies/me`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return res.json();
}

// UPDATE COMPANY
export async function updateCompany(id, data) {
  const res = await fetch(`${API_URL}/companies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return res.json();
}
