import { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../services/notificationService";
import "./management-pages.css";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const result = await getNotifications();
      const loadedNotifications = result.data || [];
      const unreadNotifications = loadedNotifications.filter((notification) => !notification.isRead);

      setNotifications(loadedNotifications);

      if (unreadNotifications.length > 0) {
        await Promise.all(unreadNotifications.map((notification) => markNotificationRead(notification.id)));

        setNotifications((current) =>
          current.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );

        window.dispatchEvent(new Event("notificationChange"));
      }
    } catch (err) {
      setError(err.message || "Notifications could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="management-page">
      <section className="management-header">
        <div>
          <p className="management-eyebrow">Notifications</p>
          <h1 className="management-title">Notifications</h1>
          <p className="management-subtitle">
            Shiko njoftimet qe vijne nga ndryshimet e statusit, pergjigjet dhe veprimet e sistemit.
          </p>
        </div>
      </section>

      {loading && <p className="management-muted">Loading notifications...</p>}
      {error && <p className="management-error">{error}</p>}

      {!loading && !error && notifications.length === 0 && (
        <p className="management-muted">Nuk ka notifications ende.</p>
      )}

      {!loading && !error && notifications.length > 0 && (
        <section className="management-list">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`management-card notification-card ${
                notification.isRead ? "" : "notification-card-unread"
              }`}
            >
              <div className="notification-card-header">
                <h2 className="management-card-title">{notification.title}</h2>
                <span className="management-pill">{notification.type}</span>
              </div>
              <p className="management-description">{notification.message}</p>
              <p className="management-muted">
                {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : "No date"}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Notification;
