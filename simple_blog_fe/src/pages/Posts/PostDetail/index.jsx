import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function PostDetail() {
  const [post, setPost] = useState();
  const { slug } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/posts/${slug}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, [slug]);
  if (!post) return <p>Loading post...</p>;
  return (
    <div style={{ padding: 20 }}>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
    </div>
  );
}

export default PostDetail;
