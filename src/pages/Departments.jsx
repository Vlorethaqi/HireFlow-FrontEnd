import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "./management-pages.css";

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
          const payload = res.data;
          setDepartments(Array.isArray(payload) ? payload : payload.data || []);
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
    <main className="management-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">Departments</h1>
          <p className="management-subtitle">Browse company departments connected to job postings.</p>
        </div>
        <input
          className="management-input"
          placeholder="Search departments"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      {error && <p className="management-error">{error}</p>}
      {loading && <p className="management-muted">Loading departments...</p>}

      {!loading && (
        <section className="management-grid">
          {departments.map((department) => (
            <article key={department.id} className="management-card">
              <h2 className="management-card-title">{department.name}</h2>
            </article>
          ))}

          {departments.length === 0 && <p className="management-muted">No departments found.</p>}
        </section>
      )}
    </main>
  );
}

export default Departments;
