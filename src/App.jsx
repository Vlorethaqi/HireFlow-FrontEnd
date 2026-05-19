import {
  Routes,
  Route,
  Link
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Users from "./pages/Users.jsx";

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

      </Routes>
    </div>
  );
}

export default App;