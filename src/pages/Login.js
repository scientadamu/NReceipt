import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const users = [
    { username: "Manager", password: "2341" },
    { username: "Ndaji Senior", password: "123456" },
    { username: "Ndagi Junior", password: "567890" },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.password === userId);
    if (user) {
      localStorage.setItem("attendant", user.username);
      navigate("/dashboard");
    } else {
      alert("Invalid User ID!");
    }
  };

  return (
    <div className="login-container">
      <h2>Attendant Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
