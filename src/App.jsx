import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Jobs from "./pages/Jobs";
import Skills from "./pages/Skills";
import Departments from "./pages/Departments";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const getUsers = () => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  };

  useEffect(() => {
    getUsers();
  }, []);

  const addUser = async () => {
    if (!name.trim() || !email.trim()) {
      return;
    }

    await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="app-brand" aria-label="HireFlow home">
          <span className="app-brand-mark">HF</span>
          <span>
            <strong>HireFlow</strong>
            <small>Recruitment Dashboard</small>
          </span>
        </NavLink>

        <nav className="app-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Users
          </NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/skills">Skills</NavLink>
          <NavLink to="/departments">Departments</NavLink>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <main className="management-page">
              <section className="management-header">
                <div>
                  <p className="management-eyebrow">Team access</p>
                  <h1 className="management-title">Users</h1>
                  <p className="management-subtitle">
                    Manage people who can access the HireFlow workspace.
                  </p>
                </div>
              </section>

              <section className="management-panel">
                <div className="management-form">
                  <input
                    className="management-input"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    className="management-input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <button
                    className="management-button management-button-primary"
                    onClick={addUser}
                    type="button"
                  >
                    Add User
                  </button>
                </div>
              </section>

              <section className="management-list">
                {users.map((user) => (
                  <article key={user.id} className="management-card management-row-card">
                    <div>
                      <h2 className="management-card-title">{user.name}</h2>
                      <p className="management-muted">{user.email}</p>
                    </div>
                    <button
                      className="management-button management-button-danger"
                      onClick={() => deleteUser(user.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </article>
                ))}

                {users.length === 0 && (
                  <p className="management-muted">No users have been added yet.</p>
                )}
              </section>
            </main>
          }
        />

        <Route path="/jobs" element={<Jobs />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/departments" element={<Departments />} />
      </Routes>
    </div>
  );
}

export default App;
