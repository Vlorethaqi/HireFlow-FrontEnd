import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Users from "./pages/Users.jsx";
import Companies from "./pages/Companies.jsx";
import CreateCompany from "./pages/CreateCompany.jsx";

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

  const adminRoute = (page) => {
    return isAdmin ? page : <Navigate to="/login" />;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>

      <nav>
        <Link to="/login">Login</Link>

        {" | "}

        <Link to="/register">
          Register
        </Link>

        {" | "}

        {isAdmin && (
          <>
            <Link to="/users">
              Users
            </Link>

            {" | "}
          </>
        )}

        {isAdmin && (
          <>
            <Link to="/companies">
              Company
            </Link>

            {" | "}
          </>
        )}

        <Link to="/companies/create">
          Create Company
        </Link>

        {user && (
          <>
            {" | "}

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </nav>

      <hr />

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/users"
          element={adminRoute(<Users />)}
        />

        <Route
          path="/companies"
          element={adminRoute(<Companies />)}
        />

        <Route
          path="/companies/create"
          element={<CreateCompany />}
        />

      </Routes>
    </div>
  );
}

export default App;
