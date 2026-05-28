import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "./management-pages.css";

const SkillsContext = createContext(null);

function useSkills() {
  return useContext(SkillsContext);
}

function SkillsProvider({ children }) {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSkills = () => {
    let isActive = true;
    setLoading(true);

    api.get("/skills")
      .then((res) => {
        if (isActive) {
          const payload = res.data;
          setSkills(Array.isArray(payload) ? payload : payload.data || []);
          setError("");
        }
      })
      .catch((err) => {
        if (isActive) {
          setError(err.response?.data?.message || "Skills could not be loaded.");
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadSkills();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch = skill.name?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? skill.category === category : true;
      return matchesSearch && matchesCategory;
    });
  }, [skills, search, category]);

  return (
    <SkillsContext.Provider
      value={{ skills: filteredSkills, search, setSearch, category, setCategory, loading, error, loadSkills, setError }}
    >
      {children}
    </SkillsContext.Provider>
  );
}

function Skills() {
  return (
    <SkillsProvider>
      <SkillsContent />
    </SkillsProvider>
  );
}

function SkillsContent() {
  const { skills, search, setSearch, category, setCategory, loading, error, loadSkills, setError } = useSkills();

  const handleDelete = async (skill) => {
    try {
      const res = await api.delete(`/skills/${skill.id}`);

      if (res.data?.success === false) {
        setError(res.data.message || "Skill could not be deleted.");
        return;
      }

      loadSkills();
    } catch (err) {
      setError(err.response?.data?.message || "Skill could not be deleted.");
      return;
    }
  };

  return (
    <main className="management-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">Skills</h1>
          <p className="management-subtitle">Search skills and filter them by category.</p>
        </div>
        <div className="management-filter-group">
          <input
            className="management-input"
            placeholder="Search skills"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="management-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="TECHNICAL">Technical</option>
            <option value="SOFT">Soft</option>
            <option value="LANGUAGE">Language</option>
            <option value="TOOL">Tool</option>
          </select>
        </div>
      </section>

      {error && <p className="management-error">{error}</p>}
      {loading && <p className="management-muted">Loading skills...</p>}

      {!loading && (
        <section className="management-grid">
          {skills.map((skill) => (
            <article key={skill.id} className="management-card">
              <h2 className="management-card-title">{skill.name}</h2>
              <p className="management-badge">{skill.category || "TECHNICAL"}</p>
              {skill.description && <p className="management-description">{skill.description}</p>}
              <div className="management-actions">
                <button
                  className="management-button management-button-danger"
                  type="button"
                  onClick={() => handleDelete(skill)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}

          {skills.length === 0 && <p className="management-muted">No skills found.</p>}
        </section>
      )}
    </main>
  );
}

export default Skills;
