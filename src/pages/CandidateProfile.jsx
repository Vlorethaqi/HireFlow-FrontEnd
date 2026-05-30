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
    cvFile: null,
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
        cvFile: null,
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

  const selectedSkills = skills.filter((skill) => form.skills.includes(String(skill.id)));

  const removeSkillFromProfile = async (skillId) => {
    const nextForm = {
      ...form,
      skills: form.skills.filter((selectedSkillId) => selectedSkillId !== String(skillId))
    };

    setForm(nextForm);

    try {
      const res = await saveMyProfile(buildProfilePayload(nextForm));

      if (res.success === false) {
        setMessage(res.message || "Skill could not be removed.");
        return;
      }

      applySavedProfile(res.data);
      setMessage("Skill removed from your profile.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Skill could not be removed.");
    }
  };

  const buildProfilePayload = (profileForm) => ({
    ...profileForm,
    experienceYears: Number(profileForm.experienceYears || 0),
    skills: profileForm.skills.map(Number)
  });

  const applySavedProfile = (profile) => {
    if (!profile) {
      return;
    }

    setForm({
      phone: profile.phone || "",
      location: profile.location || "",
      education: profile.education || "",
      experienceYears: profile.experienceYears || 0,
    cvUrl: profile.cvUrl || "",
    cvFile: null,
    githubUrl: profile.githubUrl || "",
      linkedinUrl: profile.linkedinUrl || "",
      bio: profile.bio || "",
      skills: (profile.CandidateSkills || []).map((item) => String(item.skillId))
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await saveMyProfile(buildProfilePayload(form));

      if (res.success === false) {
        setMessage(res.message);
        return;
      }

      applySavedProfile(res.data);
      setMessage("Profile saved successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Profile could not be saved.");
    }
  };

  const handleCvFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      updateField("cvFile", null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");

      updateField("cvFile", {
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        contentBase64: result.includes(",") ? result.split(",")[1] : result,
      });
    };
    reader.onerror = () => setMessage("CV file could not be loaded.");
    reader.readAsDataURL(file);
  };

  const handleCreateSkill = async () => {
    if (!newSkill.trim()) {
      return;
    }

    try {
      const res = await api.post("/skills", {
        name: newSkill.trim(),
        category: "TECHNICAL"
      });
      const createdSkill = res.data.data || res.data;
      const nextForm = {
        ...form,
        skills: [...new Set([...form.skills, String(createdSkill.id)])]
      };

      setNewSkill("");
      await loadSkills();

      const profileRes = await saveMyProfile(buildProfilePayload(nextForm));

      if (profileRes.success === false) {
        setForm(nextForm);
        setMessage(profileRes.message || "Skill was selected, but profile could not be saved.");
        return;
      }

      applySavedProfile(profileRes.data);
      setMessage("Skill added to your profile.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Skill could not be added.");
    }
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
        <label className="management-file-field">
          <span>{form.cvFile?.fileName || (form.cvUrl ? "CV uploaded" : "Upload CV")}</span>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleCvFileChange} />
        </label>
        <input className="management-input" placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => updateField("githubUrl", e.target.value)} />
        <input className="management-input" placeholder="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => updateField("linkedinUrl", e.target.value)} />
        <div className="management-chip-list management-field-wide">
          {selectedSkills.map((skill) => (
            <span className="management-skill-chip" key={skill.id}>
              {skill.name}
              <button
                aria-label={`Remove ${skill.name} from profile`}
                className="management-chip-remove"
                type="button"
                onClick={() => removeSkillFromProfile(skill.id)}
              >
                x
              </button>
            </span>
          ))}

          {selectedSkills.length === 0 && (
            <span className="management-muted">No skills added yet.</span>
          )}
        </div>
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
