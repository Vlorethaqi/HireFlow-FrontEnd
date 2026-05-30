const API_URL = "http://localhost:3000";

export async function getNotifications() {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return response.json();
}