import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

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

  useEffect(() => {
    let isActive = true;

    api.get("/skills")
      .then((res) => {
        if (isActive) {
          setSkills(res.data);
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
      value={{ skills: filteredSkills, search, setSearch, category, setCategory, loading, error }}
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
  const { skills, search, setSearch, category, setCategory, loading, error } = useSkills();

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <h1 style={styles.title}>Skills</h1>
          <p style={styles.subtitle}>Search skills and filter them by category.</p>
        </div>
        <div style={styles.filters}>
          <input
            style={styles.input}
            placeholder="Search skills"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            style={styles.input}
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

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.muted}>Loading skills...</p>}

      {!loading && (
        <section style={styles.grid}>
          {skills.map((skill) => (
            <article key={skill.id} style={styles.card}>
              <h2 style={styles.cardTitle}>{skill.name}</h2>
              <p style={styles.badge}>{skill.category || "TECHNICAL"}</p>
              {skill.description && <p style={styles.description}>{skill.description}</p>}
            </article>
          ))}

          {skills.length === 0 && <p style={styles.muted}>No skills found.</p>}
        </section>
      )}
    </main>
  );
}

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    marginBottom: "18px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#5f6b7a",
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "flex-end",
  },
  input: {
    minHeight: "40px",
    minWidth: "180px",
    padding: "8px 10px",
    border: "1px solid #d6dde6",
    borderRadius: "6px",
    background: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  card: {
    padding: "16px",
    border: "1px solid #e1e7ef",
    borderRadius: "8px",
    background: "#fff",
  },
  cardTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
  },
  badge: {
    display: "inline-block",
    margin: "0 0 10px",
    padding: "4px 8px",
    borderRadius: "6px",
    background: "#eef4ff",
    color: "#244a88",
    fontSize: "13px",
  },
  description: {
    margin: 0,
    color: "#4d5a68",
  },
  muted: {
    color: "#6b7785",
  },
  error: {
    color: "#b42318",
  },
};

export default Skills;
