import React, { useState } from 'react';
import { sendNoti, sendPromoCode } from "@api/noti";
import { playSound } from './Playsounds';


export default function NotiForm() {
  const [formData, setFormData] = useState({
    head: '',
    detail: '',
    type: 'promotion',
    code: '',
    codeType: 'percentage',
    codeLimit: '',
    codeValue: '',

  });
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem("token");
  const res_login = localStorage.getItem("res_login");
  //console.log("Login response:", JSON.parse(res_login));
  const hotel_id = JSON.parse(res_login).account.hotel_id;
  //console.log("Hotel ID:", hotel_id);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.type === "promotion code") {
      const response = await sendPromoCode(
      token,
        hotel_id,
        formData.detail,
        formData.type,
        formData.code,
        formData.codeType,
        formData.codeLimit,
        formData.codeValue
      );

  
      console.log(response);
    }
    
    else {
    const response = await 
    sendNoti(
      token,
      formData.head,
      formData.detail,
      formData.type
    )

    if (response?.success&&formData.type==="promotion") {
      playSound("/sounds/Promotionnoti.mp3");
      setSuccessMessage('Publish Promotion'); 
    }

    if (response?.success&&formData.type==="emergency") {
      playSound("/sounds/Emernoti.mp3");
      setSuccessMessage('Publish Emergency'); 
      setTimeout(() => {setSuccessMessage('');}, 3000);
    }

    console.log(response);
    }

    
    
  };

  return (
    <form onSubmit={handleSubmit} className="m-[10px]"
    >
      {formData.type!== "promotion code" && (
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
        )}
      {formData.type==="promotion code" && (
        <div>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
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
          placeholder="Code"
        />
         <select
          id="codeType"
          name="codeType"
          value={formData.codeType}
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
        >
          <option value="percentage">percentage</option>
          <option value="fixed">fixed</option>
        </select>
        <input
          type="number"
          id="codeValue"
          name="codeValue"
          value={formData.codeValue}
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
          placeholder="Value"
        />
                <input
          type="number"
          id="codeLimit"
          name="codeLimit"
          value={formData.codeLimit}
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
          placeholder="Limit"
        />
      </div>
      
      )}
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
      <div>

        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={(e) => {handleChange(e);}}
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
          <option value="promotion">Promotion</option>
          <option value="emergency">Emergency</option>
          <option value="promotion code">Promotion code</option>
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
      {successMessage && (
       <div className="text-green-600 text-center text-sm mt-4">
       {successMessage}
      </div>
      )}
    </form>
  );
}
