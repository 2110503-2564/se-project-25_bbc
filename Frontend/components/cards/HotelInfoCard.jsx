import React from 'react';
import Image from 'next/image';

const HotelInfoCard = ({ hotel = null } = {}) => {
  if (!hotel) return null;

  const imageSrc = hotel.image_url || '/images/placeholder.png'; 

  return (
    <div
      className="hotel_info_card"
      style={{
        width: '100%',
        minWidth: '300px',
        height: 'auto',
        position: 'relative',
        borderRadius: '15px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
        padding: '15px',
        color: 'black',
        backgroundColor: '#fff',
      }}
    >
      <div
        className="image_container"
        style={{
          height: '200px',
          marginBottom: '15px',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <Image
          src={imageSrc}
          alt={hotel.name}
          width={500}
          height={200}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          quality={75}
          loading="lazy"
        />
      </div>

      <div className="hotel_info">
        <h2 style={{ fontWeight: '600', marginBottom: '10px' }}>{hotel.name}</h2>
        <div style={{ fontSize: '14px', fontWeight: '300', color: '#666' }}>
          {hotel.tel && (
            <>
              <span style={{ display: 'inline-block', marginRight: '5px' }}>
                <img src="/icons/phone.svg" width="12px" alt="phone icon" />
              </span>
              {hotel.tel}
              <br />
            </>
          )}
          <span style={{ display: 'inline-block', marginRight: '5px' }}>
            <img src="/icons/map-pin-3.svg" width="12px" alt="location icon" />
          </span>
          {hotel.address.city}, {hotel.address.street_name}
        </div>
      </div>
    </div>
  );
};

export default HotelInfoCard;
