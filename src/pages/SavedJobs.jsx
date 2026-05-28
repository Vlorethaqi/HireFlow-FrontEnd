import { useEffect, useState } from "react";
import { getSavedJobs, unsaveJob } from "../services/savedJobservice";
import "./management-pages.css";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [message, setMessage] = useState("");

  const loadSavedJobs = async () => {
    const res = await getSavedJobs();
    setSavedJobs(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const handleUnsave = async (id) => {
    const res = await unsaveJob(id);
    setMessage(res.success === false ? res.message || res.error : res.message);
    loadSavedJobs();
  };

  return (
    <main className="management-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">Saved Jobs</h1>
          <p className="management-subtitle">Punet qe kandidati i ka ruajtur per me vone.</p>
        </div>
      </section>

      {message && <p className="management-success">{message}</p>}

      <section className="management-list">
        {savedJobs.map((item) => (
          <article className="management-card" key={item.id}>
            <h2 className="management-card-title">{item.Job?.title || `Job #${item.jobId}`}</h2>
            <p className="management-description">{item.Job?.description || "No description"}</p>
            <div className="management-meta">
              <span className="management-pill">{item.Job?.location || "No location"}</span>
              <span className="management-pill">{item.Job?.employmentType || "No type"}</span>
              <span className="management-pill">{item.Job?.status || "No status"}</span>
            </div>
            <div className="management-actions">
              <button className="management-button management-button-danger" type="button" onClick={() => handleUnsave(item.id)}>
                Remove
              </button>
            </div>
          </article>
        ))}

        {savedJobs.length === 0 && <p className="management-muted">Nuk keni pune te ruajtura.</p>}
      </section>
    </main>
  );
}