import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`http://localhost:8080/api/posts/${slug}`);
        const data = await res.json();
        setForm({
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        console.log(error);
        setMessage("Failed to load post");
      }
    }
    fetchPost();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/posts/${slug}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error(`Update failed. Status: ${res.status}`);
      }
      navigate(`/posts/${slug}`);
    } catch (error) {
      console.log(error);
      setMessage("Update post failed");
    }
  }
  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h3>Edit Post</h3>
      <label>Title: </label>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <br />
      <label>Description: </label>
      <input
        type="text"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <br />
      <button type="submit">Save</button>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </form>
  );
}
