import { useEffect, useState } from "react";
import api from "../services/api";
import { getMyProfile, saveMyProfile } from "../services/candidateProfileservice";
import "./management-pages.css";

export default function CandidateProfile() {
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [form, setForm] = useState({
    phone: "",
    location: "",
    education: "",
    experienceYears: 0,
    cvUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    bio: "",
    skills: []
  });

  const loadSkills = () => {
    return api.get("/skills").then((res) => {
      const payload = res.data;
      setSkills(Array.isArray(payload) ? payload : payload.data || []);
    });
  };

  useEffect(() => {
    loadSkills();
    getMyProfile().then((res) => {
      const profile = res.data;

      if (!profile) {
        return;
      }

      setForm({
        phone: profile.phone || "",
        location: profile.location || "",
        education: profile.education || "",
        experienceYears: profile.experienceYears || 0,
        cvUrl: profile.cvUrl || "",
        githubUrl: profile.githubUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        bio: profile.bio || "",
        skills: (profile.CandidateSkills || []).map((item) => String(item.skillId))
      });
    });
  }, []);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await saveMyProfile({
      ...form,
      experienceYears: Number(form.experienceYears || 0),
      skills: form.skills.map(Number)
    });

    setMessage(res.success === false ? res.message : "Profile saved successfully.");
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
          <h1 className="management-title">Candidate Profile</h1>
          <p className="management-subtitle">Ploteso profilin para se te aplikosh per pune.</p>
        </div>
      </section>

      {message && <p className="management-success">{message}</p>}

      <form className="management-form" onSubmit={handleSubmit}>
        <input className="management-input" placeholder="Phone" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
        <input className="management-input" placeholder="Location" value={form.location} onChange={(e) => updateField("location", e.target.value)} />
        <input className="management-input" placeholder="Education" value={form.education} onChange={(e) => updateField("education", e.target.value)} />
        <input className="management-input" type="number" min="0" placeholder="Experience years" value={form.experienceYears} onChange={(e) => updateField("experienceYears", e.target.value)} />
        <input className="management-input" placeholder="CV URL" value={form.cvUrl} onChange={(e) => updateField("cvUrl", e.target.value)} />
        <input className="management-input" placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => updateField("githubUrl", e.target.value)} />
        <input className="management-input" placeholder="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => updateField("linkedinUrl", e.target.value)} />
        <select
          className="management-select management-field-wide"
          multiple
          value={form.skills}
          onChange={(e) => updateField("skills", [...e.target.selectedOptions].map((option) => option.value))}
        >
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>{skill.name}</option>
          ))}
        </select>
        <div className="management-inline management-field-wide">
          <input
            className="management-input"
            placeholder="Add your skill, e.g. React"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button className="management-button" type="button" onClick={handleCreateSkill}>
            Add Skill
          </button>
        </div>
        <textarea className="management-input management-field-wide" placeholder="Bio" value={form.bio} onChange={(e) => updateField("bio", e.target.value)} />
        <button className="management-button management-button-primary" type="submit">Save Profile</button>
      </form>
    </main>
  );
}