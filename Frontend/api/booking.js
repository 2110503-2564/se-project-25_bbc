const URL = process.env.NEXT_PUBLIC_API_URL;

export async function createBooking({
  token,
  account_id,
  hotel_id,
  room_id,
  status = "pending",
  checkInDate,
  checkOutDate,
  numPeople,
  total_price,
}) {
  try {
    const res = await fetch(`${URL}/api/booking/pending`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // from NextAuth or localStorage
      },
      body: JSON.stringify({
        account_id:account_id,
        hotel_id:hotel_id,
        room_id:room_id,
        status:status,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_people: numPeople,
        total_price:total_price,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to create booking");
    }

    return data;
  } catch (error) {
    console.error("Booking creation error:", error);
    throw error;
  }
}
