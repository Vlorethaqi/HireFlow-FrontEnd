import { authFetch } from "./authFetch";

// CREATE COMPANY + ADMIN
export async function createCompany(data) {
  const res = await authFetch("/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

// GET MY COMPANY
export async function getMyCompany() {
  const res = await authFetch("/companies/me");

  return res.json();
}

// UPDATE COMPANY
export async function updateCompany(id, data) {
  const res = await authFetch(`/companies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}
