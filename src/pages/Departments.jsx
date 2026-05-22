import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const DepartmentsContext = createContext(null);

function useDepartments() {
  return useContext(DepartmentsContext);
}

function DepartmentsProvider({ children }) {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    api.get("/departments")
      .then((res) => {
        if (isActive) {
          setDepartments(res.data);
          setError("");
        }
      })
      .catch((err) => {
        if (isActive) {
          setError(err.response?.data?.message || "Departments could not be loaded.");
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

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) =>
      department.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  return (
    <DepartmentsContext.Provider
      value={{ departments: filteredDepartments, search, setSearch, loading, error }}
    >
      {children}
    </DepartmentsContext.Provider>
  );
}

function Departments() {
  return (
    <DepartmentsProvider>
      <DepartmentsContent />
    </DepartmentsProvider>
  );
}

function DepartmentsContent() {
  const { departments, search, setSearch, loading, error } = useDepartments();

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <h1 style={styles.title}>Departments</h1>
          <p style={styles.subtitle}>Browse company departments connected to job postings.</p>
        </div>
        <input
          style={styles.search}
          placeholder="Search departments"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.muted}>Loading departments...</p>}

      {!loading && (
        <section style={styles.grid}>
          {departments.map((department) => (
            <article key={department.id} style={styles.card}>
              <h2 style={styles.cardTitle}>{department.name}</h2>
              <p style={styles.muted}>Company ID: {department.companyId}</p>
            </article>
          ))}

          {departments.length === 0 && <p style={styles.muted}>No departments found.</p>}
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
  search: {
    minHeight: "40px",
    minWidth: "240px",
    padding: "8px 10px",
    border: "1px solid #d6dde6",
    borderRadius: "6px",
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
    margin: "0 0 8px",
    fontSize: "20px",
  },
  muted: {
    color: "#6b7785",
  },
  error: {
    color: "#b42318",
  },
};

export default Departments;
