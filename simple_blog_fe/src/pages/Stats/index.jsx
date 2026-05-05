import { useState, useEffect } from "react";

export default function Stats({ user }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("http://localhost:8080/api/users/stats");
        const result = await res.json();
        if (!res.ok) {
          setMessage(result.massage || "Failed to load users");
        }
        setUsers(result);
      } catch (error) {
        setMessage(error.message || "Failed to load users");
      }
    }
    fetchUsers();
  }, []);
  return (
    <>
      <h1>This is Stats Page !</h1>
      <h2>Xin chào: {user?.username}</h2>
      <h2>Danh sách user:</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <ul>
        {users.map((item) => (
          <li key={item.id}>{item.username}</li>
        ))}
      </ul>
    </>
  );
}
