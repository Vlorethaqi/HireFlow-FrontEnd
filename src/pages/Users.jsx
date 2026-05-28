import { useEffect, useState } from "react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from "../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("WORKER");
  const [editId, setEditId] = useState(null);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async () => {
    const res = editId
      ? await updateUser(editId, {
        name,
        email,
        role
      })
      : await createUser({
      name,
      email,
      role,
      password: "123456"
    });

    if (res.success === false) {
      alert(res.message);
      return;
    }

    setName("");
    setEmail("");
    setRole("WORKER");
    setEditId(null);
    loadUsers();
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setName(user.name || "");
    setEmail(user.email || "");
    setRole(user.role || "WORKER");
  };

  const handleCancel = () => {
    setName("");
    setEmail("");
    setRole("WORKER");
    setEditId(null);
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  return (
    <div>
      <h1>Users</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="WORKER">WORKER</option>
        <option value="HR">HR</option>
      </select>

      <button onClick={handleAdd}>
        {editId ? "Update" : "Add"}
      </button>

      {editId && (
        <button onClick={handleCancel}>
          Cancel
        </button>
      )}

      <hr />

      {users.map((u) => (
        <div key={u.id}>
          {u.name} - {u.email} - {u.role}

          {u.role !== "ADMIN" && (
            <>
              <button onClick={() => handleEdit(u)}>
                Edit
              </button>

              <button onClick={() => handleDelete(u.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
