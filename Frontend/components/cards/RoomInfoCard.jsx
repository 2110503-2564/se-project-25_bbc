import Image from 'next/image'

export const RoomInfoCard = ({ room, isSelected, onToggle }) => (
  <div className="flex w-full">
    <div className="relative w-1/3 min-w-[150px] h-[250px]">
      <Image src={room.image_url} alt={room.type} fill className="object-cover" />
    </div>
    <div className="p-4 flex flex-col justify-between w-2/3 text-left">
      <div>
        <h3 className="text-lg font-semibold">{room.type}</h3>
        <p className="text-sm text-gray-500">Room No. {room.room_number}</p>
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <div>💲 {room.rate_per_night} / night</div>
          <div>🛏️ {room.capacity} people</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`mt-4 py-2 px-4 rounded-md font-semibold text-white ${
          isSelected ? 'bg-gray-500' : 'bg-blue-500'
        }`}
      >
        {isSelected ? 'Cancel' : 'Select This Room'}
      </button>
    </div>
  </div>
)
