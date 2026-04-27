import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // GET USERS
  const getUsers = () => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    getUsers();
  }, []);

  // ADD USER
  const addUser = async () => {
    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password: "123456"
      })
    });

    setName("");
    setEmail("");

    getUsers();
  };

  // DELETE USER
  const deleteUser = async (id) => {
    console.log("Deleting ID:", id);

    await fetch(`http://localhost:3000/users/${id}`, { //ketu dergojme request ne backend
      method: "DELETE"
    });

    getUsers();//rifreskon listen
  };

  return (
    <div>
      <h1>HireFlow Users</h1>

      {/* INPUTS */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={addUser}>Add User</button>

      <hr />

      {/* USERS LIST */}
      {users.map((user) => (
        <div key={user.id}>
          <p>{user.name} - {user.email}</p>

          <button onClick={() => deleteUser(user.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;