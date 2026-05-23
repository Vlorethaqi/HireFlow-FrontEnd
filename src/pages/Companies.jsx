import { useEffect, useState } from "react";
import { getMyCompany, updateCompany } from "../services/companyService";
import { createJob } from "../services/jobService";

export default function Companies() {
  const [company, setCompany] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [deadline, setDeadline] = useState("");

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

  const handleCreateJob = async () => {
    if (!jobTitle || !jobDescription || !employmentType) {
      alert("Job title, description and employment type are required.");
      return;
    }

    const payload = {
      title: jobTitle,
      description: jobDescription,
      location: jobLocation || null,
      employmentType,
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      deadline: deadline || null
    };

    const res = await createJob(payload);

    if (res.success === false) {
      alert(res.message);
      return;
    }

    alert("Job created successfully!");
    setJobTitle("");
    setJobDescription("");
    setJobLocation("");
    setEmploymentType("FULL_TIME");
    setSalaryMin("");
    setSalaryMax("");
    setDeadline("");
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

          <hr />

          <h2>Create Job</h2>

          <input
            placeholder="Job title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />

          <input
            placeholder="Job description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <input
            placeholder="Job location"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
          />

          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
          >
            <option value="FULL_TIME">Full time</option>
            <option value="PART_TIME">Part time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="CONTRACT">Contract</option>
          </select>

          <input
            type="number"
            placeholder="Minimum salary"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
          />

          <input
            type="number"
            placeholder="Maximum salary"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button onClick={handleCreateJob}>
            Create Job
          </button>
        </div>
      )}
    </div>
  );
}
