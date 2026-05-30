import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const accessToken =
  localStorage.getItem("accessToken") ||
  localStorage.getItem("token") ||
  sessionStorage.getItem("accessToken") ||
  sessionStorage.getItem("token");
      if (!accessToken) {
        setError("Nuk u gjet accessToken. Ju lutem kyçuni përsëri.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gabim gjatë marrjes së notifications.");
      }

      setNotifications(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-card">
      <h1>Notifications</h1>
      <p>Shiko njoftimet e tua.</p>

      {loading && <p>Duke u ngarkuar...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <p>Nuk ka notifications ende.</p>
      )}

      {!loading &&
        !error &&
        notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "10px",
              backgroundColor: notification.isRead ? "#fff" : "#eef4ff",
            }}
          >
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <small>Type: {notification.type}</small>
          </div>
        ))}
    </div>
  );
}

export default Notification;