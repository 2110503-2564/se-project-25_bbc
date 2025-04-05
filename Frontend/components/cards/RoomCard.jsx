import Image from 'next/image'
import BookButton from '@components/buttons/BookButton'
import Link from 'next/link'

const RoomCard = ({ room = null } = {}) => {
  return (
    <div
      className='hdcard_white'
      style={{
        width: "30vw",
        minWidth: "250px",
        height: "300px",
        position: "relative",
        display: "inline-block",
        flexShrink: 0,
        scrollSnapAlign: "center",
        color: "black",
        borderRadius: "15px"
      }}
    >
      <div className="bigcard_image_container" style={{ height: "60%" }}>
        <Image
          src={room.image_url}
          alt={room.type}
          fill
          style={{ objectFit: 'cover' }}
          quality={75}
          loading="lazy"
        />
      </div>

      <div
        style={{
          fontWeight: "600",
          position: "absolute",
          top: "calc(60% + 20px)",
          left: "8px",
          right: "8px",
          textAlign: "left"
        }}
      >
        {room.type}
        <br />
        <div style={{ marginBottom: "0px" }}>
          <div style={{ display: "inline-block", marginRight: "3px", marginBottom: "-1px" }}>
            <img src='/icons/dollar-sign.svg' width="12px" />
          </div>
          <span
            className='main_text'
            style={{ fontSize: "12px", fontWeight: "600", lineHeight: "0px" }}
          >
            {room.rate_per_night}
            <span className='sub_text' style={{ fontWeight: "200", marginLeft: "3px" }}>
              Per night
            </span>
          </span>
        </div>

        <span
          className='main_text'
          style={{ fontSize: "12px", fontWeight: "600", lineHeight: "0px" }}
        >
          <div style={{ display: "inline-block", marginRight: "3px", marginBottom: "-1px" }}>
            <img src='/icons/bed-single.svg' width="12px" />
          </div>
          {room.capacity}
          <span className='sub_text' style={{ fontWeight: "200", marginLeft: "3px" }}>
            People
          </span>
        </span>
        <br />
        <span className='sub_text' style={{
          opacity: "0.5", fontSize: "18px", fontWeight: "600",
          lineHeight: "25px", position: "absolute", right: "10px", top: "-2px"
        }}>
          no.{room.room_number}
        </span>
      </div>

      {/* Only this is a client component */}
      <BookButton room={room} />
    </div>
  )
}

export default RoomCard
