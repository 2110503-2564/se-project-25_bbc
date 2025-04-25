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

export async function searchBookingsPopulateAccountId({
  token
}){
  try{
    const res = await fetch(`${URL}/api/booking/search?populate=account_id`,{
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

export async function searchBookingsPopulateFields({ token, populateFields = [] }) {
  // Join the fields into a query string to pass to the API
  const populateQuery = populateFields.length ? `populate=${populateFields.join(',')}` : '';

  try {
    const res = await fetch(`${URL}/api/booking/search?${populateQuery}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Error fetching bookings with message: ${data.message}`);
    }

    return data;
  } catch (error) {
    console.error('Search Booking error:', error);
    throw error;
  }
}


export async function getBooking({
  token,
  query = ""
}) {
  try {
    // console.log(token)
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


export async function createBooking(token , formData) {
  try {

    console.log(formData);

    const res = await fetch(`${URL}/api/booking/pending`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
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
    const res = await fetch(`${URL}/api/booking/${status}/${booking_id}`, {
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


export async function deleteBooking(token, booking_id, hotel_id) {
  try {
    const requestBody = {
      booking_id: booking_id,
      ...(hotel_id && { hotel_id }), // Only include hotel_id if it exists
    };

    const res = await fetch(`${URL}/api/booking/${booking_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to delete booking");
    }

    return data; // Consider returning the response data for further use
  } catch (error) {
    console.error("Delete booking error:", error); // Prefer `console.error` for errors
    throw error;
  }
}

export async function changeBookingStatus({ token, booking_id, new_status }) {
  try {
    let url = `${URL}/api/booking/${booking_id}`;
    switch (new_status) {
      case 'accepted':
        url = `${URL}/api/booking/accept/${booking_id}`;
        break;
      case 'rejected':
        url = `${URL}/api/booking/reject/${booking_id}`;
        break;
      case 'confirmed':
        url = `${URL}/api/booking/confirm/${booking_id}`;
        break;
      case 'finished':
        url = `${URL}/api/booking/finish/${booking_id}`;
        break;
      case 'canceled':
        url = `${URL}/api/booking/cancel/${booking_id}`;
        break;
      default:
        throw new Error('Invalid status');
    }

    console.log("📦 changeBookingStatus → URL:", url);
    console.log("📦 changeBookingStatus → token:", token);
    console.log("📦 changeBookingStatus → booking_id:", booking_id);

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
         booking_id:booking_id,
         status: new_status 
        })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Response not OK", data);
      throw new Error(data.message || "Failed to update booking status");
    }

    return data;
  } catch (error) {
    console.error("Change Booking Status Error:", error);
    throw error;
  }
}

export async function uploadReceiptImage({
  booking_id,
  file,
  token,
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("booking_id", booking_id);

  const response = await fetch(`${URL}/api/booking/receipt/${booking_id}`, {
    method: "POST",
    headers: {
        Authorization: `Bearer ${token}`
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Upload failed");
  }

  return data;
}
