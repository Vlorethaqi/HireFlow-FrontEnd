import { useEffect, useState } from "react";
import api from "../services/api";
import { createJob } from "../services/jobService";
import "./management-pages.css";

export default function CreateJob() {
  const [skills, setSkills] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    employmentType: "FULL_TIME",
    salaryMin: "",
    salaryMax: "",
    deadline: "",
    departmentId: "",
    skills: [],
    requirements: ""
  });

  const loadSkills = () => {
    return api.get("/skills").then((res) => {
      const payload = res.data;
      setSkills(Array.isArray(payload) ? payload : payload.data || []);
    });
  };

  useEffect(() => {
    loadSkills();
    api.get("/departments").then((res) => {
      const payload = res.data;
      setDepartments(Array.isArray(payload) ? payload : payload.data || []);
    }).catch(() => setDepartments([]));
  }, []);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await createJob({
      ...form,
      salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
      salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      departmentId: form.departmentId ? Number(form.departmentId) : null,
      skills: form.skills.map((skillId) => ({ skillId: Number(skillId), importanceLevel: "REQUIRED" })),
      requirements: form.requirements.split("\n").map((item) => item.trim()).filter(Boolean)
    });

    if (res.success === false) {
      setMessage(res.message);
      return;
    }

    setMessage("Job created successfully.");
    setForm({
      title: "",
      description: "",
      location: "",
      employmentType: "FULL_TIME",
      salaryMin: "",
      salaryMax: "",
      deadline: "",
      departmentId: "",
      skills: [],
      requirements: ""
    });
  };

  const handleCreateSkill = async () => {
    if (!newSkill.trim()) {
      return;
    }

    const res = await api.post("/skills", {
      name: newSkill.trim(),
      category: "TECHNICAL"
    });
    const createdSkill = res.data.data || res.data;

    setNewSkill("");
    await loadSkills();
    setForm((current) => ({
      ...current,
      skills: [...new Set([...current.skills, String(createdSkill.id)])]
    }));
  };

  return (
    <main className="management-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">Create Job</h1>
          <p className="management-subtitle">Krijo pozite pune dhe lidhe me skills qe kerkohen.</p>
        </div>
      </section>

      {message && <p className="management-success">{message}</p>}

      <form className="management-form" onSubmit={handleSubmit}>
        <input className="management-input" placeholder="Job title" value={form.title} onChange={(e) => updateField("title", e.target.value)} required />
        <input className="management-input" placeholder="Location" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
        <select className="management-select" value={form.employmentType} onChange={(e) => updateField("employmentType", e.target.value)}>
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
        </select>
        <input className="management-input" type="number" placeholder="Minimum salary" value={form.salaryMin} onChange={(e) => updateField("salaryMin", e.target.value)} />
        <input className="management-input" type="number" placeholder="Maximum salary" value={form.salaryMax} onChange={(e) => updateField("salaryMax", e.target.value)} />
        <input className="management-input" type="date" value={form.deadline} onChange={(e) => updateField("deadline", e.target.value)} />
        <select className="management-select" value={form.departmentId} onChange={(e) => updateField("departmentId", e.target.value)}>
          <option value="">Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>{department.name}</option>
          ))}
        </select>
        <select className="management-select management-field-wide" multiple value={form.skills} onChange={(e) => updateField("skills", [...e.target.selectedOptions].map((option) => option.value))}>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>{skill.name}</option>
          ))}
        </select>
        <div className="management-inline management-field-wide">
          <input
            className="management-input"
            placeholder="Add required skill, e.g. Node.js"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button className="management-button" type="button" onClick={handleCreateSkill}>
            Add Skill
          </button>
        </div>
        <textarea className="management-input management-field-wide" placeholder="Description" value={form.description} onChange={(e) => updateField("description", e.target.value)} required />
        <textarea className="management-input management-field-wide" placeholder="Requirements, one per line" value={form.requirements} onChange={(e) => updateField("requirements", e.target.value)} />
        <button className="management-button management-button-primary" type="submit">Create Job</button>
      </form>
    </main>
  );
}
