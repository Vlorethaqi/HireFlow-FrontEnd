import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";
import "./management-pages.css";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyApplications().then((res) => {
      if (res.success === false) {
        setError(res.message || res.error || "Applications could not be loaded.");
        return;
      }

      setApplications(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  return (
    <main className="management-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">Application Status</h1>
          <p className="management-subtitle">Ketu kandidati i sheh aplikimet dhe statusin e tyre.</p>
        </div>
      </section>

      {error && <p className="management-error">{error}</p>}

      <section className="management-list">
        {applications.map((application) => (
          <article className="management-card" key={application.id}>
            <h2 className="management-card-title">{application.Job?.title || `Application #${application.id}`}</h2>
            <p className="management-description">{application.coverLetter || "No cover letter"}</p>
            <div className="management-meta">
              <span className="management-pill">Status: {application.ApplicationStatus?.name || application.statusId}</span>
              <span className="management-pill">{application.Job?.location || "No location"}</span>
              <span className="management-pill">{application.Job?.employmentType || "No type"}</span>
            </div>
          </article>
        ))}

        {applications.length === 0 && <p className="management-muted">Nuk keni aplikuar ende.</p>}
      </section>
    </main>
  );
}