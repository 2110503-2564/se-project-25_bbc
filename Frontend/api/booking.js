const URL = process.env.NEXT_PUBLIC_API_URL;

export async function searchBookings({
  token
}){
  try{
    const res = await fetch(`${URL}/api/booking/search`,{
      method:"GET",
      headers:{
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json();

    if(!res.ok){
      throw new Error(`Error fecth bookings with message: ${data.message}`);
    }

    return data ;

  }catch (error) {
    console.error("Search Booking error:", error);
    throw error;
  }
}

export async function getBooking({
  token,
  query = ""
}) {
  try {
    const res = await fetch(`${URL}/api/booking/search?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Error get booking with message: ${data.message}`);
    }

    return data;

  } catch (error) {
    console.error("Get Booking error", error);
    throw error;
  }
}


export async function createBooking({
  token,
  account_id,
  hotel_id,
  room_id,
  status = "pending",
  checkInDate,    // camelCase parameter
  checkOutDate,   // camelCase parameter
  numPeople,      // camelCase parameter
  total_price,
}) {
  try {
    const res = await fetch(`${URL}/api/booking/pending`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        account_id,
        hotel_id,
        room_id,
        status,
        num_people: numPeople,       // Convert to snake_case
        check_in_date: checkInDate,   // Convert to snake_case
        check_out_date: checkOutDate, // Convert to snake_cas
        total_price,
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
