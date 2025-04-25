export const RoomSelectionForm = ({
  capacity,
  numPeople,
  setNumPeople,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  onUpdateClick
}) => (
  <div className="px-6 py-6 bg-white rounded-b-2xl shadow-md border border-gray-200">
    <div className="grid grid-cols-1 gap-5">
      <InputField label="Number of People">
        <input
          type="number"
          value={numPeople}
          min={1}
          max={capacity}
          onChange={(e) => setNumPeople(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </InputField>

      <InputField label="Check-in Date">
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </InputField>

      <InputField label="Check-out Date">
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </InputField>
    </div>

    <button
      onClick={onUpdateClick}
      className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-semibold transition shadow-sm"
    >
      Update Booking
    </button>
  </div>
);

const InputField = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 text-left">{label}</label>
    {children}
  </div>
);