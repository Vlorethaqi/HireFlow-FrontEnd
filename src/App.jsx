import {
  Routes,
  Route,
  Link
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Users from "./pages/Users.jsx";
import Companies from "./pages/Companies.jsx";
import CreateCompany from "./pages/CreateCompany.jsx";

function App() {

  return (
    <div>

      <nav>
        <Link to="/login">Login</Link>

        {" | "}

        <Link to="/register">
          Register
        </Link>

        {" | "}

        <Link to="/users">
          Users
        </Link>

        {" | "}

        <Link to="/companies">
          Company
        </Link>

        {" | "}

        <Link to="/companies/create">
          Create Company
        </Link>
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
          element={<Users />}
        />

        <Route
          path="/companies"
          element={<Companies />}
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
