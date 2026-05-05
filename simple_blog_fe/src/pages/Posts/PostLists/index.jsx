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
  // async function handleDelete(slug) {
  //   const confirmed = window.confirm("Delete this post ?");
  //   if (!confirmed) return;
  //   try {
  //     const res = await fetch(`http://localhost:8080/api/posts/${slug}`, {
  //       method: "DELETE",
  //       credentials: "include",
  //     });
  //     if (!res.ok) {
  //       throw new Error(`Delete failed. Status: ${res.status}`);
  //     }
  //     setPosts((currentPosts) =>
  //       currentPosts.filter((post) => post.slug !== slug),
  //     );
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //     setError("Xóa bài viết thất bại");
  //   }
  // }
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
              {/* {user && (
                <button
                  type="button"
                  onClick={() => handleDelete(d.slug)}
                  style={{ marginLeft: 10 }}
                >
                  Delete
                </button>
              )} */}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
