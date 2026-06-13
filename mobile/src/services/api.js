export const API_BASE = "https://vibez-api.onrender.com/api";
export const DEMO_USER_ID = "user-a";

export async function updateLocation(latitude, longitude) {
  return fetch(`${API_BASE}/location`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": DEMO_USER_ID,
    },
    body: JSON.stringify({ latitude, longitude }),
  });
}

export async function getNearbyUsers() {
  const response = await fetch(`${API_BASE}/nearby`, {
    headers: {
      "X-User-Id": DEMO_USER_ID,
    },
  });

  return response.json();
}

export async function sendConnectionRequest(receiverId) {
  return fetch(`${API_BASE}/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": DEMO_USER_ID,
    },
    body: JSON.stringify({
      receiver_id: receiverId,
      note: "Saw you nearby and wanted to connect.",
    }),
  });
}