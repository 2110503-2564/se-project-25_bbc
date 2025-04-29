const URL = process.env.NEXT_PUBLIC_API_URL;

export const sendNoti = async (token = "" , head, detail, type) => {
  try {
    const res = await fetch(`${URL}/api/chat/notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ head, detail, type })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to send notification");

    return data;
  } catch (error) {
    console.error("Error sending notification:", error);
    return null;
  }
};

export const sendPromoCode = async (token = "" , hotel_id, detail, type, expire, code, discountType, limit, discountValue) => {
  try {
    const res = await fetch(`${URL}/api/promo/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({detail, hotel_id, expire, type, code, discountType, limit, discountValue })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to send promotion code");

    return data;
  } catch (error) {
    console.error("Error sending promotion code", error);
    return null;
  }
}