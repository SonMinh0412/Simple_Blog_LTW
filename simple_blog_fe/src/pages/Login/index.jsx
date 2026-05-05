import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login({ onLogin }) {
  const [creds, setCreds] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(creds),
      });
      const result = await res.json();
      if (!res.ok) {
        setMessage(result.message || "Login failed");
        return;
      }
      onLogin && onLogin(result);
      navigate("/posts");
    } catch (error) {
      setMessage(error.message || "Login failed");
    }
  }
  return (
    <form onSubmit={handleLogin}>
      <div style={{ padding: 10 }}>
        <br />
        <span>Username: </span>
        <br />
        <input
          type="text"
          value={creds.username}
          onChange={(e) => setCreds({ ...creds, username: e.target.value })}
        />
        <br />
        <span>Password: </span>
        <br />
        <input
          type="password"
          value={creds.password}
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        />
        <br />
        <button type="submit">Login</button>
        {message && <p style={{ color: "red" }}>{message}</p>}
      </div>
    </form>
  );
}
