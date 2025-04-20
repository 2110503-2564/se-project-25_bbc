const URL = process.env.NEXT_PUBLIC_API_URL;

export const sendNoti = async (token = "" , head, detail, expire, type) => {
  try {
    const res = await fetch(`${URL}/api/chat/promotion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ head, detail, expire, type })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to send notification");

    return data;
  } catch (error) {
    console.error("Error sending notification:", error);
    return null;
  }
};
