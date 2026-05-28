import { useEffect, useState } from "react";
import {
  analyzeApplication,
  createApplicationResponse,
  createApplicationReview,
  getApplicationStatuses,
  getCompanyApplications,
  updateApplicationStatus
} from "../services/applicationService";
import "./management-pages.css";

export default function HRReview() {
  const [applications, setApplications] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [reviewForms, setReviewForms] = useState({});

  const loadApplications = async () => {
    const res = await getCompanyApplications();
    setApplications(Array.isArray(res.data) ? res.data : []);
  };

  const loadStatuses = async () => {
    const res = await getApplicationStatuses();
    setStatuses(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      Promise.all([loadApplications(), loadStatuses()]);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const updateReviewForm = (applicationId, field, value) => {
    setReviewForms((current) => ({
      ...current,
      [applicationId]: {
        rating: "3",
        comment: "",
        statusId: "",
        ...current[applicationId],
        [field]: value
      }
    }));
  };

  const handleReview = async (application) => {
    const form = reviewForms[application.id] || {};
    const statusId = Number(form.statusId || application.statusId);
    const rating = Number(form.rating || 3);
    const comment = form.comment || "";

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

    const statusUpdate = await updateApplicationStatus(application.id, statusId);

    if (statusUpdate.success === false) {
      setMessage(statusUpdate.message || statusUpdate.error || "Status could not be updated.");
      return;
    }

    setMessage("Review and status saved.");
    await loadApplications();
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
        {applications.map((application) => {
          const form = reviewForms[application.id] || {};

          return (
            <article className="management-card" key={application.id}>
              <h2 className="management-card-title">
                {application.Job?.title || `Application #${application.id}`}
              </h2>
              <p className="management-description">{application.coverLetter || "No cover letter"}</p>
              <div className="management-meta">
                <span className="management-pill">Status: {application.ApplicationStatus?.name || application.statusId}</span>
                <span className="management-pill">Candidate profile: {application.candidateProfileId}</span>
              </div>
              <div className="management-form">
                <select
                  className="management-select"
                  value={form.rating || "3"}
                  onChange={(e) => updateReviewForm(application.id, "rating", e.target.value)}
                >
                  <option value="1">Rating 1</option>
                  <option value="2">Rating 2</option>
                  <option value="3">Rating 3</option>
                  <option value="4">Rating 4</option>
                  <option value="5">Rating 5</option>
                </select>
                <select
                  className="management-select"
                  value={form.statusId || application.statusId || ""}
                  onChange={(e) => updateReviewForm(application.id, "statusId", e.target.value)}
                >
                  <option value="">Status</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>{status.name}</option>
                  ))}
                </select>
                <input
                  className="management-input"
                  placeholder="Review comment"
                  value={form.comment || ""}
                  onChange={(e) => updateReviewForm(application.id, "comment", e.target.value)}
                />
              </div>
              <div className="management-actions">
                <button className="management-button" type="button" onClick={() => handleReview(application)}>Save Review</button>
                <button className="management-button" type="button" onClick={() => handleResponse(application)}>Response</button>
                <button className="management-button management-button-primary" type="button" onClick={() => handleAi(application)}>AI Analyze</button>
              </div>
            </article>
          );
        })}

        {applications.length === 0 && <p className="management-muted">No applications yet.</p>}
      </section>
    </main>
  );
}
