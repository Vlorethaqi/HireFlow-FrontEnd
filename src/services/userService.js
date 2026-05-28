import { authFetch } from "./authFetch";

// GET USERS
export async function getUsers() {
  const res = await authFetch("/users");

  return res.json();
}

// CREATE USER
export async function createUser(data) {
  const res = await authFetch("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

// UPDATE USER
export async function updateUser(id, data) {
  const res = await authFetch(`/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

// DELETE USER
export async function deleteUser(id) {
  const res = await authFetch(`/users/${id}`, {
    method: "DELETE"
  });

  return res.json();
}
