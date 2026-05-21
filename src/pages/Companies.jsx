import { useEffect, useState } from "react";
import { getMyCompany, updateCompany } from "../services/companyService";

export default function Companies() {
  const [company, setCompany] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const loadCompany = async () => {
    const res = await getMyCompany();

    if (res.success === false) {
      alert(res.message);
      return;
    }

    setCompany(res.data);
    setName(res.data.name || "");
    setEmail(res.data.email || "");
    setPhone(res.data.phone || "");
    setLocation(res.data.location || "");
    setDescription(res.data.description || "");
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const handleUpdate = async () => {
    if (!company) return;

    const res = await updateCompany(company.id, {
      name,
      email,
      phone,
      location,
      description
    });

    if (res.success === false) {
      alert(res.message);
    } else {
      alert("Company updated successfully!");
      loadCompany();
    }
  };

  return (
    <div>
      <h1>Company</h1>

      {!company && (
        <p>No company loaded</p>
      )}

      {company && (
        <div>
          <input
            placeholder="Company name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Company email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button onClick={handleUpdate}>
            Update
          </button>
        </div>
      )}
    </div>
  );
}
