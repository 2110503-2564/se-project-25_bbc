import React from 'react'
import RoomCard from '@components/cards/RoomCard'

const RoomList = async ({
  rooms=[]
}) => {

  return (
    <div>
    {
    rooms.length > 0 ? 
      <div style={containerStyle}>
        {
          rooms.map((room, index) => (
            <div
            key={room._id}
            >
              <RoomCard room={room}/>
            </div>
          ))
        }
      </div>
     : <></>
    }
    </div>
  )
}

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px", // Space between cards
  justifyContent: "center", // Align items to the center,
  marginTop: "10px",
};

export default RoomList