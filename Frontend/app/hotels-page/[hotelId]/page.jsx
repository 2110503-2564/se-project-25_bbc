import React from "react";
import { cookies } from 'next/headers'
import { searchHotel } from "@api/hotel";
import { searchRoom } from "@api/room";
import { insertChat } from "@api/chat";
import Image from "@node_modules/next/image";
import RoomList from "@components/lists/RoomList";

const page = async ({ params }) => {
  const cookieStore = cookies();
  const token = await cookieStore.get('token')?.value

  const { hotelId } = await params;
  const hotelData = await searchHotel(`_id=${hotelId}`);
  const roomData = await searchRoom(`hotel_id=${hotelId}`);

  await insertChat(token , hotelId);

  const hotel = hotelData.hotels[0];
  const rooms = roomData.rooms;
  

  return (
    <div>
      <div
        style={{
          width: "100%",
          height: "100vh",
          zIndex: "-300",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
        }}
      >
        <Image
          src={hotel.image_url}
          alt="hotel"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div
        className="align_item_center"
        style={{
          position: "absolute",
          width: "100%",
          height: "100vh",
          top: "0",
          left: "0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            textAlign: "center",
            left: "40px",
            right: "40px",
            padding: "50px",
            backgroundColor: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            WebkitMaskImage: `linear-gradient(to top, transparent, black 30%),
                    linear-gradient(to bottom, transparent, black 30%),
                    linear-gradient(to left, transparent, black 20%),
                    linear-gradient(to right, transparent, black 20%)`,
            WebkitMaskComposite: "destination-in",
            maskComposite: "intersect",
            borderRadius: "60px",
          }}
        >
          <h1 className="home_header" style={{ color: "white" }}>
            {hotel.name}
          </h1>
          <div className="home_text" style={{ color: "white" }}>
            {hotel.description}
          </div>
        </div>
      </div>
      <div>
        <RoomList rooms={rooms} />
      </div>
    </div>
  );
};

export default page;
