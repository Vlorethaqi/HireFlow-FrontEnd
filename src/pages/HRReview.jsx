import { useEffect, useState } from "react";
import {
  analyzeApplication,
  createApplicationResponse,
  createApplicationReview,
  getCompanyApplications,
  updateApplicationStatus
} from "../services/applicationService";
import "./management-pages.css";

const statusOptions = [
  { id: 1, name: "PENDING" },
  { id: 2, name: "REVIEWED" },
  { id: 3, name: "INTERVIEW" },
  { id: 4, name: "ACCEPTED" },
  { id: 5, name: "REJECTED" }
];

export default function HRReview() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const loadApplications = async () => {
    const res = await getCompanyApplications();
    setApplications(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleReview = async (application) => {
    const rating = Number(window.prompt("Rating 1-5", "3") || 3);
    const comment = window.prompt("Review comment", "") || "";
    const statusId = Number(window.prompt("Status ID: 1 PENDING, 2 REVIEWED, 3 INTERVIEW, 4 ACCEPTED, 5 REJECTED", "2") || 2);

    const review = await createApplicationReview({
      applicationId: application.id,
      rating,
      comment,
      recommendation: "NEUTRAL"
    });

    if (review.success === false) {
      setMessage(review.message);
      return;
    }

    await updateApplicationStatus(application.id, statusId);
    setMessage("Review and status saved.");
    loadApplications();
  };

  const handleResponse = async (application) => {
    const responseMessage = window.prompt("Response message", "") || "";
    const status = window.prompt("Response status: ACCEPTED, REJECTED, INTERVIEW, PENDING", "PENDING") || "PENDING";

    const res = await createApplicationResponse({
      applicationId: application.id,
      message: responseMessage,
      status
    });

    setMessage(res.success === false ? res.message : "Response sent.");
  };

  const handleAi = async (application) => {
    const res = await analyzeApplication(application.id);
    setAnalysis(res.data || res);
  };

  return (
    <main className="management-page">
      <section className="management-header">
        <div>
          <h1 className="management-title">HR Review</h1>
          <p className="management-subtitle">Shiko aplikimet e kompanise, bej review, status dhe response.</p>
        </div>
        <button className="management-button" type="button" onClick={loadApplications}>Refresh</button>
      </section>

      {message && <p className="management-success">{message}</p>}
      {analysis && (
        <pre className="management-pre">{JSON.stringify(analysis, null, 2)}</pre>
      )}

      <section className="management-list">
        {applications.map((application) => (
          <article className="management-card" key={application.id}>
            <h2 className="management-card-title">
              {application.Job?.title || `Application #${application.id}`}
            </h2>
            <p className="management-description">{application.coverLetter || "No cover letter"}</p>
            <div className="management-meta">
              <span className="management-pill">Status: {application.ApplicationStatus?.name || application.statusId}</span>
              <span className="management-pill">Candidate profile: {application.candidateProfileId}</span>
            </div>
            <div className="management-actions">
              <button className="management-button" type="button" onClick={() => handleReview(application)}>Review</button>
              <button className="management-button" type="button" onClick={() => handleResponse(application)}>Response</button>
              <button className="management-button management-button-primary" type="button" onClick={() => handleAi(application)}>AI Analyze</button>
            </div>
          </article>
        ))}

        {applications.length === 0 && <p className="management-muted">No applications yet.</p>}
      </section>
    </main>
  );
}

export { statusOptions };
