import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes } from "react-router-dom";

import CandidateProfile from "./pages/CandidateProfile.jsx";
import Companies from "./pages/Companies.jsx";
import CreateCompany from "./pages/CreateCompany.jsx";
import CreateJob from "./pages/CreateJob.jsx";
import Departments from "./pages/Departments";
import HRReview from "./pages/HRReview.jsx";
import Jobs from "./pages/Jobs.jsx";
import Login from "./pages/Login.jsx";
import MyApplications from "./pages/MyApplication.jsx";
import Register from "./pages/Register.jsx";
import SavedJobs from "./pages/SavedJobs.jsx";
import Skills from "./pages/Skills.jsx";
import Users from "./pages/Users.jsx";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  const loadUser = () => {
    const savedUser = localStorage.getItem("user");
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("authChange", loadUser);

    return () => {
      window.removeEventListener("authChange", loadUser);
    };
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const canManageCompany = ["ADMIN", "HR"].includes(user?.role);

  const authRoute = (page) => (user ? page : <Navigate to="/login" />);
  const adminRoute = (page) => (isAdmin ? page : <Navigate to="/login" />);
  const companyRoute = (page) => (canManageCompany ? page : <Navigate to="/login" />);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link className="app-brand" to="/jobs">
          <span className="app-brand-mark">HF</span>
          <span>
            <strong>HireFlow</strong>
            <small>{user ? `${user.name} - ${user.role}` : "Recruitment system"}</small>
          </span>
        </Link>

        <nav className="app-nav">
          <NavLink to="/jobs">Jobs</NavLink>

          {user?.role === "CANDIDATE" && (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/applications">Application Status</NavLink>
              <NavLink to="/saved-jobs">Saved Jobs</NavLink>
            </>
          )}

          {user && <NavLink to="/companies/create">Create Company</NavLink>}

          {canManageCompany && (
            <>
              <NavLink to="/departments">Departments</NavLink>
              <NavLink to="/jobs/create">Create Job</NavLink>
              <NavLink to="/hr-review">HR Review</NavLink>
            </>
          )}

          {isAdmin && (
            <>
              <NavLink to="/users">Users</NavLink>
              <NavLink to="/companies">Company</NavLink>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}

          {user && (
            <button className="nav-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/skills" element={companyRoute(<Skills />)} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={authRoute(<CandidateProfile />)} />
        <Route path="/applications" element={authRoute(<MyApplications />)} />
        <Route path="/saved-jobs" element={authRoute(<SavedJobs />)} />
        <Route path="/companies/create" element={authRoute(<CreateCompany />)} />

        <Route path="/departments" element={companyRoute(<Departments />)} />
        <Route path="/jobs/create" element={companyRoute(<CreateJob />)} />
        <Route path="/hr-review" element={companyRoute(<HRReview />)} />

        <Route path="/users" element={adminRoute(<Users />)} />
        <Route path="/companies" element={adminRoute(<Companies />)} />
      </Routes>
    </div>
  );
}

export default App;
