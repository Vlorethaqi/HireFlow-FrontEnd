import { useEffect, useState } from "react";
import CandidateProfile from "./components/CandidateProfile";
import SavedAndAppliedJobs from "./components/SavedAndAppliedJobs";

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
    await fetch(`http://localhost:3000/users/${id}`, { 
      method: "DELETE"
    });
    getUsers();
  };

  return (
    // Çdo gjë duhet të jetë brenda këtij div-i kryesor
    <div style={{ backgroundColor: "#1a202c", minHeight: "100vh", color: "white", padding: "20px" }}>
      
      {/* 👥 KODI I KOLEGËS (Mbetet i paprekur) */}
      <h1>HireFlow Users</h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginRight: "10px", padding: "5px" }}
      />

      <button onClick={addUser} style={{ padding: "5px 10px" }}>Add User</button>

      <hr />

      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <p style={{ display: "inline-block", marginRight: "10px" }}>{user.name} - {user.email}</p>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}

      {/* ➖➖➖➖➖➖ VIZA NDARËSE DHE MODULI YT 1: PROFILI ➖➖➖➖➖➖ */}
      <hr style={{ margin: "40px 0", border: "2px solid #ccc" }} />
      <CandidateProfile />

      {/* ➖➖➖➖➖➖ VIZA NDARËSE DHE MODULI YT 2 & 3: APPLIKIMET E PUNËS ➖➖➖➖➖➖ */}
      <hr style={{ margin: "40px 0", border: "2px solid #ccc" }} />
      <SavedAndAppliedJobs />

    </div>
  );
}

export default App;