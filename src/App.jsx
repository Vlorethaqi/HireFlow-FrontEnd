import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Users from "./pages/Users.jsx";
import Companies from "./pages/Companies.jsx";
import CreateCompany from "./pages/CreateCompany.jsx";

import Jobs from "./pages/Jobs";
import Skills from "./pages/Skills";
import Departments from "./pages/Departments";

function App() {
  // ================= AUTH STATE =================
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  // ================= USERS CRUD STATE =================
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const getUsers = () => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    loadUser();
    getUsers();

    window.addEventListener("authChange", loadUser);

    return () => {
      window.removeEventListener("authChange", loadUser);
    };
  }, []);

  const isAdmin = user?.role === "ADMIN";

  const adminRoute = (page) => {
    return isAdmin ? page : <Navigate to="/login" />;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ================= USERS ACTIONS =================
  const addUser = async () => {
    if (!name.trim() || !email.trim()) return;

    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password: "123456",
      }),
    });

    setName("");
    setEmail("");
    getUsers();
  };

  const deleteUser = async (id) => {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
    });

    getUsers();
  };

  return (
    <div>

      {/* AUTH NAV */}
      <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}

        {isAdmin && (
          <>
            <Link to="/users">Users</Link> |{" "}
            <Link to="/companies">Company</Link> |{" "}
          </>
        )}

        <Link to="/companies/create">Create Company</Link>

        {user && (
          <>
            {" | "}
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      {/* APP NAV */}
      <header>
        <NavLink to="/">Home</NavLink> |{" "}
        <NavLink to="/jobs">Jobs</NavLink> |{" "}
        <NavLink to="/skills">Skills</NavLink> |{" "}
        <NavLink to="/departments">Departments</NavLink>
      </header>

      {/* ROUTES */}
      <Routes>

        {/* HOME / USERS CRUD (i koleges) */}
        <Route
          path="/"
          element={
            <div>
              <h1>Users Management</h1>

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

              <button onClick={addUser}>Add User</button>

              {users.map((u) => (
                <div key={u.id}>
                  {u.name} - {u.email}
                  <button onClick={() => deleteUser(u.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          }
        />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN */}
        <Route path="/users" element={adminRoute(<Users />)} />
        <Route path="/companies" element={adminRoute(<Companies />)} />
        <Route path="/companies/create" element={<CreateCompany />} />

        {/* OTHER MODULES (tuat e tuat) */}
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/departments" element={<Departments />} />

      </Routes>
    </div>
  );
}

export default App;