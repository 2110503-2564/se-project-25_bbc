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
    console.log(token)
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
  receiptUrl,
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
        receiptUrl,
      }),
    });
    
    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to create booking");
    }

    return data;
  } catch (error) {
    console.error("Booking creation error:", error);
    throw error;
  }
}

export async function updateBooking({
  token,
  booking_id,
  hotel_id,
  room_number,
  num_people,
  check_in_date,
  check_out_date
}){
  try {
    console.log("Update booking:", booking_id, hotel_id, room_number, num_people, check_in_date, check_out_date);
    console
    const res = await fetch(`${URL}/api/booking/${booking_id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        hotel_id: hotel_id,
        room_number: room_number,
        num_people: num_people,
        check_in_date: check_in_date,
        check_out_date: check_out_date,
      })
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to update booking");
    }

  } catch(error) {
    console.log("Update booking error:", error);
    throw error;
  }
}

export async function updateBookingStatus(
  token,
  booking_id,
  hotel_id,
  room_id,
  status,
){
  try {
    console.log("Update booking status:", booking_id, hotel_id, room_id, status);
    const res = await fetch(`${URL}/api/booking/${status}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        booking_id: booking_id,
        room_id: room_id,
        hotel_id: hotel_id,
      })
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to update booking status");
    }

  } catch(error) {
    console.log("Update booking status error:", error);
    throw error;
  }
}

export async function deleteBooking(
  token,
  booking_id,
  hotel_id
){
  try{
    const res = await fetch(`${URL}/api/booking/${booking_id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        booking_id:booking_id,
        hotel_id: hotel_id,
      })
    });

    const data = await res.json();
    console.log(data);

    if(!res.ok){
      throw new Error(data.message || "Failed to delete booking");
    }

  }catch(error) {
    console.log("Delete booking error:", error);
    throw error;
  }
}