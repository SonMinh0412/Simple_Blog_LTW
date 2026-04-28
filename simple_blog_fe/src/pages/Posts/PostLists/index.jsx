import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
export default function PostLists() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/posts");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const result = await res.json();
        setPosts(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("An error occurred while fetching the data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : posts.length === 0 ? (
        <p>Chưa có bài post nào</p>
      ) : (
        <ul>
          {posts.map((d) => (
            <li key={d.slug}>
              <Link to={`/posts/${d.slug}`}>{d.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
