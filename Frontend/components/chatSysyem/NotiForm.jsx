import React, { useState } from 'react';
import { sendNoti } from "@api/noti";

export default function NotiForm() {
  const [showDate, setShowDate] = useState(true);
  const [formData, setFormData] = useState({
    head: '',
    detail: '',
    expire: '',
    type: 'promotion',
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    setShowDate(value === "promotion");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await 
    sendNoti(
      token,
      formData.head,
      formData.detail,
      formData.expire,
      formData.type
    )

    console.log(response);
    
  };

  return (
    <form onSubmit={handleSubmit} className="m-[10px]"
    >
      <div>
        <input
          type="text"
          id="head"
          name="head"
          value={formData.head}
          onChange={handleChange}
          style={{
            width:"100%",
            borderRadius: "10px",
            boxSizing: "border-box",
            paddingLeft: "20px",
            paddingRight: "20px",
            backgroundColor: "white",
          }}
          className="mt-1 mb-[20px] block w-full border-none rounded p-2"
          placeholder="Title"
        />
      </div>

      <div>
        <input
          type="text"
          id="detail"
          name="detail"
          value={formData.detail}
          onChange={handleChange}
          style={{
            width:"100%",
            borderRadius: "10px",
            boxSizing: "border-box",
            paddingLeft: "20px",
            paddingRight: "20px",
            backgroundColor: "white",
          }}
          className="mt-1 mb-[20px] block w-full border-none rounded p-2"
          placeholder="Detail"
        />
      </div>
      {showDate && (
      <div>
        <input
          type="datetime-local"
          id="expire"
          name="expire"
          value={formData.expire}
          onChange={handleChange}
          style={{
            width:"100%",
            borderRadius: "10px",
            boxSizing: "border-box",
            paddingLeft: "20px",
            paddingRight: "20px",
            backgroundColor: "white",
          }}
          className="mt-1 mb-[20px] block w-full border-none rounded p-2"
        />
      </div>
      )}
      <div>

        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={(e) => {handleChange(e); handleSelectChange(e)}}
          style={{
            width:"100%",
            borderRadius: "10px",
            boxSizing: "border-box",
            paddingLeft: "20px",
            paddingRight: "20px",
            backgroundColor: "white",
          }}
          className="mt-1 mb-[20px] block w-full border-none rounded p-2"
        >
          <option value="promotion">promotion</option>
          <option value="emergency">emergency</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-2 main_bg font-bold text-white rounded px-4 py-2 hover:bg-blue-600"
        style={{
          width:"100%",
          borderRadius: "20px",
        }}
      >
        Publish
      </button>
    </form>
  );
}
