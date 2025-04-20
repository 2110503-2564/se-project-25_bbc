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
    <div className="px-4 py-4 border-t text-left">
      <div className="grid grid-cols-1 gap-4">
        <InputField label="Number of People">
          <input
            type="number"
            value={numPeople}
            min={1}
            max={capacity}
            onChange={(e) => setNumPeople(Number(e.target.value))}
            className="input"
          />
        </InputField>
  
        <InputField label="Check-in Date">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="input"
          />
        </InputField>
  
        <InputField label="Check-out Date">
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="input"
          />
        </InputField>
      </div>
  
      <button
        onClick={onUpdateClick}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded-md font-semibold"
      >
        Update Booking
      </button>
    </div>
  )
  
  const InputField = ({ label, children }) => (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      {children}
    </div>
  )
  