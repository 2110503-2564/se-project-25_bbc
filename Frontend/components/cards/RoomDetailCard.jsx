import Image from "@node_modules/next/image";

export const RoomDetailCard = ({ room = null ,hotelName=""}) => {
    if (!room) return null;
  
    return (
      <div className="relative left-0 top-20 w-[30%] h-[95vh] mx-2 bg-white shadow-lg rounded-2xl overflow-hidden">
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
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-blue-700 capitalize">
            Room Number:<span>{room.room_number}</span>
          </h2>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Room Type:</span> {room.type}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Hotel Name:</span> {hotelName}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Capacity:</span> {room.capacity} guests
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-semibold">Rate:</span> ${room.rate_per_night} / night
          </p>
          <p className={`mt-2 font-semibold ${
            room.isAvailable ? 'text-green-600' : 'text-red-500'
          }`}>
            {room.isAvailable ? 'Available' : 'Not Available'}
          </p>
          <p className="text-gray-600 mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem, adipisci! Dolorum consequuntur dicta sint ipsa iure eius quae iusto, modi asperiores dolores quibusdam maiores porro, sed culpa voluptatem tempore consequatur.
          </p>
        </div>
      </div>
    );
};
