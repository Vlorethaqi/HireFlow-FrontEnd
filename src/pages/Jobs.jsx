import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const JobsContext = createContext(null);

function useJobs() {
  return useContext(JobsContext);
}

function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    employmentType: "",
    location: "",
    skill: "",
  });

  const queryParams = useMemo(() => {
    return Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value.trim() !== "")
    );
  }, [filters]);

  useEffect(() => {
    let isActive = true;

    api.get("/jobs", { params: queryParams })
      .then((res) => {
        if (!isActive) {
          return;
        }

        const payload = res.data;

        if (Array.isArray(payload)) {
          setJobs(payload);
          setPagination(null);
        } else {
          setJobs(payload.data || []);
          setPagination(payload.pagination || null);
        }

        setError("");
      })
      .catch((err) => {
        if (isActive) {
          setError(err.response?.data?.message || "Jobs could not be loaded.");
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
  }, [queryParams]);

  const updateFilter = (name, value) => {
    setLoading(true);
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setLoading(true);
    setFilters({
      search: "",
      status: "",
      employmentType: "",
      location: "",
      skill: "",
    });
  };

  return (
    <JobsContext.Provider
      value={{ jobs, pagination, loading, error, filters, updateFilter, clearFilters }}
    >
      {children}
    </JobsContext.Provider>
  );
}

function Jobs() {
  return (
    <JobsProvider>
      <JobsContent />
    </JobsProvider>
  );
}

function JobsContent() {
  const { jobs, pagination, loading, error, filters, updateFilter, clearFilters } = useJobs();

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <h1 style={styles.title}>Jobs</h1>
          <p style={styles.subtitle}>Search and filter positions by role, location, type, status, and skill.</p>
        </div>
        <button type="button" onClick={clearFilters} style={styles.secondaryButton}>
          Clear
        </button>
      </section>

      <section style={styles.filters}>
        <input
          style={styles.input}
          placeholder="Search title or description"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Location"
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Skill"
          value={filters.skill}
          onChange={(e) => updateFilter("skill", e.target.value)}
        />
        <select
          style={styles.input}
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select
          style={styles.input}
          value={filters.employmentType}
          onChange={(e) => updateFilter("employmentType", e.target.value)}
        >
          <option value="">All types</option>
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
        </select>
      </section>

      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.muted}>Loading jobs...</p>}

      {!loading && (
        <section style={styles.list}>
          {jobs.map((job) => (
            <article key={job.id} style={styles.card}>
              <div>
                <h2 style={styles.cardTitle}>{job.title}</h2>
                <p style={styles.description}>{job.description}</p>
              </div>
              <div style={styles.meta}>
                <span>{job.location || "No location"}</span>
                <span>{job.employmentType || "No type"}</span>
                <span>{job.status || "No status"}</span>
              </div>
            </article>
          ))}

          {jobs.length === 0 && <p style={styles.muted}>No jobs match the selected filters.</p>}

          {pagination && (
            <p style={styles.muted}>
              Showing {jobs.length} of {pagination.total} results
            </p>
          )}
        </section>
      )}
    </main>
  );
}

const styles = {
  page: {
    maxWidth: "1100px",
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
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
    gap: "10px",
    marginBottom: "18px",
  },
  input: {
    minHeight: "40px",
    padding: "8px 10px",
    border: "1px solid #d6dde6",
    borderRadius: "6px",
    background: "#fff",
  },
  secondaryButton: {
    minHeight: "38px",
    padding: "8px 14px",
    border: "1px solid #c9d3df",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
  },
  list: {
    display: "grid",
    gap: "12px",
  },
  card: {
    display: "grid",
    gap: "12px",
    padding: "16px",
    border: "1px solid #e1e7ef",
    borderRadius: "8px",
    background: "#fff",
  },
  cardTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
  },
  description: {
    margin: 0,
    color: "#4d5a68",
    lineHeight: 1.5,
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    color: "#324253",
    fontSize: "14px",
  },
  muted: {
    color: "#6b7785",
  },
  error: {
    color: "#b42318",
  },
};

export default Jobs;
