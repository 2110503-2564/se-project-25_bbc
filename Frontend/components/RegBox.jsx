"use client";
import { useState } from "react";
import { registerUser } from "@api/auth";

export default function RegBox() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !tel || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await registerUser(firstName, lastName, email, tel, password);
      
      if (response.success) {
        //localStorage.setItem("token", response.token);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during registration.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="" style={containerStyle}>
      
      <div style={inputContainerStyle}>
        <input className="text" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
      </div>
      <div style={inputContainerStyle}>
        <input className="text" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
      </div>
      <div style={inputContainerStyle}>
        <input className="text" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
      </div>
      <div style={inputContainerStyle}>
        <input className="text" type="tel" placeholder="Phone Number" value={tel} onChange={(e) => setTel(e.target.value)} style={inputStyle} />
      </div>
      <div style={inputContainerStyle}>
        <input className="text" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
      </div>
      
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      
      <button className="main_bg text" onClick={handleRegister} style={buttonStyle}>
        Register
      </button>
    </div>
  );
}

const containerStyle = {
  maxWidth: "300px",
  margin: "0px auto",
  padding: "20px",
  textAlign: "center",
  position: "relative"
};

const inputContainerStyle = {
  position: "relative",
  marginBottom: "10px",
};

const inputStyle = {
  width: "calc(100%)",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  outline: "none"
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  fontWeight: "600",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};
