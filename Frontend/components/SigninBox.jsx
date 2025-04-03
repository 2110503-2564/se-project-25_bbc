"use client";
import { useState } from "react";

export default function SigninBox() {
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const handleLogin = async () => {
    if (!uid) {
      setError("User ID cannot be empty");
      return;
    }

    try {
      const response = await vendorLogin(uid, password);

      if (response.message == "Login as vendor successfully") {
        localStorage.setItem("tokenVendor", response.token);
        localStorage.setItem("storeIdVendor", response.vendor.store_id);
        localStorage.setItem("nameVendor", response.vendor.username);
        window.location.reload();
      } else {
        setError("Login failed. Please check your User ID.");
      }
    } catch (err) {
      setError("An error occurred during login.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="" style={containerStyle}>

     

      <h2 className="text" style={{ textAlign: "center", marginBottom: "20px" }}>&nbsp;</h2>

      <div style={inputContainerStyle}>
        <input className="text"
          type="tel"
          placeholder="เบอร์โทรศัพท์"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          style={inputStyle}
          inputMode="numeric"
          maxLength={10}
        />
      </div>
      <div style={inputContainerStyle}>
        <input
          className="text"
          type="text"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <button className="main_bg text" onClick={handleLogin} style={buttonStyle}>
        เข้าสู่ระบบ
      </button>
    </div>
  );
}

const containerStyle = {
  maxWidth: "300px",
  margin: "50px auto",
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
