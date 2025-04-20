const URL = process.env.NEXT_PUBLIC_API_URL;

export const insertChat = async (token = "" , hotel_id) => {
  try {
    const res = await fetch(`${URL}/api/chat/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ hotel_id })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to insert chat");

    return data;
  } catch (error) {
    console.error("Error insert chat:", error);
    return null;
  }
};
