import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "./management-pages.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const res = await login({
      email,
      password
    });

    console.log("LOGIN RESPONSE:", res);

    if (res.success === false) {
      setMessage(res.message);
    } else {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      window.dispatchEvent(new Event("authChange"));
      navigate(location.state?.from || "/jobs");
    }
  };

  return (
    <main className="management-page auth-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">Login</h1>
          <p className="management-subtitle">Kycu per te aplikuar, menaxhuar profilin ose punet e kompanise.</p>
        </div>
      </section>

      {message && <p className="management-error">{message}</p>}

      <form className="management-form" onSubmit={handleLogin}>
        <input
          className="management-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="management-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="management-button management-button-primary" type="submit">
          Login
        </button>
      </form>
    </main>
  );
}
