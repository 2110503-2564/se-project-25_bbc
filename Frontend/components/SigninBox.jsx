"use client";
import { useState } from "react";
import { signinUser } from "@api/auth";
import { useRouter } from "next/navigation";

export default function SigninBox() {
  const router = useRouter();
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
      const response = await signinUser(uid, password);

      if (response.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", response.token);
          document.cookie = `token=${response.token}; path=/; max-age=36000`;
          window.location.href = "/" // Reload the page to apply the token and direct to home page
        }
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
          type="text"
          placeholder="Email or Telephone"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div style={inputContainerStyle}>
        <input
          className="text"
          type={isRevealing? "text":"password"}
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <img
          src={isRevealing ? "/icons/hide.png" : "/icons/view.png"}
          alt="Toggle password visibility"
          onClick={() => setIsRevealing((prev) => !prev)}
          style={eyeImageStyle}
        />
      </div>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <button className="main_bg text" onClick={handleLogin} style={buttonStyle}>
        Sign-In
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

const eyeImageStyle = {
  position: "absolute",
  top: "50%",
  right: "10px",
  transform: "translateY(-50%)",
  width: "20px",
  height: "20px",
  cursor: "pointer",
  zIndex: 2,
};