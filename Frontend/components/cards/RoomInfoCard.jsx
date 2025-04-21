import Image from "next/image";

export const RoomInfoCard = ({ room, isSelected, onToggle }) => (
  <div className="flex w-full bg-gray-100 shadow-lg">
    <div className="relative w-1/3 min-w-[150px] h-[250px]">
      <Image
        src={room.image_url}
        alt={room.type}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-4 flex flex-col justify-between w-2/3 text-left">
      <div>
        <h3 className="text-lg font-semibold">{room.type}</h3>
        <p className="text-sm text-gray-500">Room No. {room.room_number}</p>
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <img src="/icons/dollar-sign.svg" className="w-4 h-4 mr-1" />
            <span className="font-medium">{room.rate_per_night}</span>
            <span className="text-gray-400 ml-2">/ night</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <img src="/icons/bed-single.svg" className="w-4 h-4 mr-1" />
            <span className="font-medium">{room.capacity}</span>
            <span className="text-gray-400 ml-2">people</span>
          </div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`mt-4 py-2 px-4 rounded-md font-semibold text-white transition-colors duration-200 ${
          isSelected
            ? "bg-gray-500 hover:bg-gray-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isSelected ? "Cancel" : "Select This Room"}
      </button>
    </div>
  </div>
);
