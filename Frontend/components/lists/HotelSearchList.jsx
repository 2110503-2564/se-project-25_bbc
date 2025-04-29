"use client";

import React, { useState } from 'react';
import HotelSelectCard from '@components/cards/HotelSelectCard';

const HotelSearchList = ({ hotels }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter hotels by name (case-insensitive)
  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="search" style={{ textAlign: 'center', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search hotels"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '8px',
            paddingLeft: '20px',
            paddingRight:'20px',
            width: '80%',
            backgroundColor:"white",
            maxWidth: '400px',
            borderRadius: '6px',
          }}
        />
      </div>
      <div style={containerStyle}>
        {filteredHotels.map(hotel => (
          <div key={hotel._id}>
            <HotelSelectCard hotel={hotel} />
          </div>
        ))}
      </div>
    </>
  );
};

const containerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "16px", // Space between cards
  justifyContent: "center", // Align items to the center,
  marginTop: "10px",
};

export default HotelSearchList;
