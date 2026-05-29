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
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loadUser = () => {
    const savedUser = sessionStorage.getItem("user");
    setUser(savedUser ? JSON.parse(savedUser) : null);
  };

  useEffect(() => {
    window.addEventListener("authChange", loadUser);

    return () => {
      window.removeEventListener("authChange", loadUser);
    };
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const isHr = user?.role === "HR";
  const canReviewApplications = isAdmin || isHr;
  const canCreateCompany = Boolean(user && !isHr && !user.companyId);

  const authRoute = (page) => (user ? page : <Navigate to="/login" />);
  const adminRoute = (page) => (isAdmin ? page : <Navigate to="/login" />);
  const reviewRoute = (page) => (canReviewApplications ? page : <Navigate to="/login" />);
  const createCompanyRoute = (page) => (canCreateCompany ? page : <Navigate to="/jobs" />);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
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
              <NavLink to="/departments">Departments</NavLink>
              <NavLink to="/applications">Application Status</NavLink>
              <NavLink to="/saved-jobs">Saved Jobs</NavLink>
            </>
          )}

          {canCreateCompany && <NavLink to="/companies/create">Create Company</NavLink>}

          {isAdmin && (
            <>
              <NavLink to="/departments">Departments</NavLink>
              <NavLink to="/skills">Skills</NavLink>
              <NavLink to="/jobs/create">Create Job</NavLink>
            </>
          )}

          {canReviewApplications && (
            <>
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
        <Route path="/skills" element={adminRoute(<Skills />)} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={authRoute(<CandidateProfile />)} />
        <Route path="/applications" element={authRoute(<MyApplications />)} />
        <Route path="/saved-jobs" element={authRoute(<SavedJobs />)} />
        <Route path="/companies/create" element={createCompanyRoute(<CreateCompany />)} />

        <Route path="/departments" element={authRoute(<Departments />)} />
        <Route path="/jobs/create" element={adminRoute(<CreateJob />)} />
        <Route path="/hr-review" element={reviewRoute(<HRReview />)} />

        <Route path="/users" element={adminRoute(<Users />)} />
        <Route path="/companies" element={adminRoute(<Companies />)} />
      </Routes>
    </div>
  );
}

export default App;
