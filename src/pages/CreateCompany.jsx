import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompany } from "../services/companyService";
import "./management-pages.css";

export default function CreateCompany() {
  const navigate = useNavigate();
  const [loggedUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    companyEmail: "",
    phone: "",
    location: "",
    description: "",
    password: ""
  });

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateCompany = async (event) => {
    event.preventDefault();

    const res = await createCompany({
      ...form,
      adminName: loggedUser?.name,
      adminEmail: loggedUser?.email
    });

    if (res.success === false) {
      setMessage(res.message);
      return;
    }

    sessionStorage.setItem("token", res.accessToken || res.token);
    sessionStorage.setItem("refreshToken", res.refreshToken);
    sessionStorage.setItem("user", JSON.stringify(res.user || res.admin));
    window.dispatchEvent(new Event("authChange"));
    navigate("/companies");
  };

  return (
    <main className="management-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">Create Company</h1>
          <p className="management-subtitle">
            Company krijohet nga user-i i kycur dhe ai user behet admin i kompanise.
          </p>
        </div>
      </section>

      {message && <p className="management-error">{message}</p>}

      <form className="management-form" onSubmit={handleCreateCompany}>
        <input className="management-input" placeholder="Company name" value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
        <input className="management-input" placeholder="Company email" value={form.companyEmail} onChange={(e) => updateField("companyEmail", e.target.value)} required />
        <input className="management-input" placeholder="Phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
        <input className="management-input" placeholder="Location" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
        <input className="management-input" placeholder="Admin email" value={loggedUser?.email || ""} disabled />
        <input className="management-input" type="password" placeholder="Password only if creating admin without logged user" value={form.password} onChange={(e) => updateField("password", e.target.value)} />
        <textarea className="management-input management-field-wide" placeholder="Description" value={form.description} onChange={(e) => updateField("description", e.target.value)} />
        <button className="management-button management-button-primary" type="submit">Create Company</button>
      </form>
    </main>
  );
}
