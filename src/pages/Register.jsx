import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "./management-pages.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    const res = await register({
      name,
      email,
      password
    });

    console.log("REGISTER RESPONSE:", res);

    if (res.success === false) {
      setMessage(res.message);
    } else {
      navigate("/login", { state: { from: "/jobs" } });
    }
  };

  return (
    <main className="management-page auth-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">Register</h1>
          <p className="management-subtitle">Krijo llogari si kandidat. Pas register do te shkosh te login.</p>
        </div>
      </section>

      {message && <p className="management-error">{message}</p>}

      <form className="management-form" onSubmit={handleRegister}>
        <input
          className="management-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Register
        </button>
      </form>
    </main>
  );
}
