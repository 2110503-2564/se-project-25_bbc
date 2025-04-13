import Image from "@node_modules/next/image";

export const RoomDetailCard = ({ room = null ,hotelName=""}) => {
    if (!room) return null;
  
    return (
      <div className="relative left-0 top-20 w-[30%] h-[95vh] mx-2 hdcard_white overflow-hidden">
        {/* Room Image */}
        <div className="relative w-full h-60">
          <Image
            src={room.image_url}
            alt={`Room - ${room.type}`}
            fill
            className="object-cover"
            priority
          />
        </div>
  
        {/* Room Details */}
        <div className="p-6" style={{fontSize:"14px"}}>
          <h2 className="text-2xl font-bold mb-2 capitalize">
            <span>{room.type}</span>
          </h2>

          <table className="w-full text-sm ">
            <tbody>
              <tr>
                <td className="font-semibold pr-4 py-1 text-gray-500">Room Number:</td>
                <td className="sub_text font-light">
                {room.room_number}
                </td>
              </tr>
              <tr>
                <td className="font-semibold  pr-4 py-1 text-gray-500">Hotel Name:</td>
                <td className="sub_text font-light">{hotelName}</td>
              </tr>
              <tr>
                <td className="font-semibold  pr-4 py-1 text-gray-500">Capacity:</td>
                <td className="sub_text font-light">{room.capacity} guests</td>
              </tr>
              <tr>
                <td className="font-semibold  pr-4 py-1 text-gray-500">Total Guest:</td>
                <td className="sub_text font-light">{room.rate_per_night} / night</td>
              </tr>
            </tbody>
          </table>

          <p className={`mt-2 font-semibold ${
            room.isAvailable ? 'main_text' : 'un_text'
          }`}>
            {room.isAvailable ? 'Available' : 'Not Available'}
          </p>

          <p className="sub_text mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, adipisci! Dolorum consequuntur dicta sint ipsa iure eius quae iusto, modi asperiores dolores quibusdam maiores porro, sed culpa voluptatem tempore consequatur.
          </p>
        </div>
      </div>
    );
};
