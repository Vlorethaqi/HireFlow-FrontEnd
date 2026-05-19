import { useEffect, useState } from "react";
import { getUsers, createUser, deleteUser } from "../services/userService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async () => {
    await createUser({
      name,
      email,
      password: "123456"
    });

    setName("");
    setEmail("");
    loadUsers();
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

      <button onClick={handleAdd}>Add</button>

      <hr />

      {users.map((u) => (
        <div key={u.id}>
          {u.name} - {u.email}
          <button onClick={() => handleDelete(u.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}