import { useState } from "react";
import { createCompany } from "../services/companyService";

export default function CreateCompany() {
  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateCompany = async () => {
    const res = await createCompany({
      name,
      companyEmail,
      phone,
      location,
      adminName,
      adminEmail,
      password
    });

    console.log("CREATE COMPANY RESPONSE:", res);

    if (res.success === false) {
      alert(res.message);
    } else {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.admin));
      window.dispatchEvent(new Event("authChange"));
      alert("Company created successfully!");
    }
  };

  return (
    <div>
      <h1>Create Company</h1>

      <input
        placeholder="Company name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Company email"
        value={companyEmail}
        onChange={(e) => setCompanyEmail(e.target.value)}
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <hr />

      <input
        placeholder="Admin name"
        value={adminName}
        onChange={(e) => setAdminName(e.target.value)}
      />

      <input
        placeholder="Admin email"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleCreateCompany}>
        Create Company
      </button>
    </div>
  );
}
