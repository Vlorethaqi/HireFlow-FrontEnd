import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "./management-pages.css";

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
    <main className="management-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">Jobs</h1>
          <p className="management-subtitle">Search and filter positions by role, location, type, status, and skill.</p>
        </div>
        <button type="button" onClick={clearFilters} className="management-button">
          Clear
        </button>
      </section>

      <section className="management-filters">
        <input
          className="management-input"
          placeholder="Search title or description"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
        <input
          className="management-input"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
        />
        <input
          className="management-input"
          placeholder="Skill"
          value={filters.skill}
          onChange={(e) => updateFilter("skill", e.target.value)}
        />
        <select
          className="management-select"
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLOSED">Closed</option>
        </select>
        <select
          className="management-select"
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

      {error && <p className="management-error">{error}</p>}
      {loading && <p className="management-muted">Loading jobs...</p>}

      {!loading && (
        <section className="management-list">
          {jobs.map((job) => (
            <article key={job.id} className="management-card">
              <div>
                <h2 className="management-card-title">{job.title}</h2>
                <p className="management-description">{job.description}</p>
              </div>
              <div className="management-meta">
                <span className="management-pill">{job.location || "No location"}</span>
                <span className="management-pill">{job.employmentType || "No type"}</span>
                <span className="management-pill">{job.status || "No status"}</span>
              </div>
            </article>
          ))}

          {jobs.length === 0 && <p className="management-muted">No jobs match the selected filters.</p>}

          {pagination && (
            <p className="management-muted">
              Showing {jobs.length} of {pagination.total} results
            </p>
          )}
        </section>
      )}
    </main>
  );
}

export default Jobs;
