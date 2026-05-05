import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function PostDetail() {
  const [post, setPost] = useState();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
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
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/posts/${slug}/comments`,
        );
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchData();
    fetchComments();
  }, [slug]);
  async function handleDelete() {
    const confirmed = window.confirm("Delete this post ?");
    if (!confirmed) return;
    try {
      const res = await fetch(`http://localhost:8080/api/posts/${slug}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Delete failed. Status : ${res.status}`);
      }
      navigate("/posts");
    } catch (error) {
      console.error("Deleting error: ", error);
    }
  }
  async function handleAddComment(e) {
    e.preventDefault();
    setCommentMessage("");
    try {
      const res = await fetch(
        `http://localhost:8080/api/posts/${slug}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ content: commentText }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setCommentMessage(data.message || "Comment failed");
        return;
      }
      setComments((currentComments) => [data, ...currentComments]);
      setCommentText("");
    } catch (error) {
      console.log(error);
      setCommentMessage("Comment failed");
    }
  }
  if (!post) return <p>Loading post...</p>;
  return (
    <div style={{ padding: 20 }}>
      <h3>{post.title}</h3>
      <p>{post.description}</p>
      <button type="button" onClick={() => navigate(`/posts/${slug}/edit`)}>
        Edit
      </button>
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Comment</button>
      </form>
      {commentMessage && <p style={{ color: "red" }}>{commentMessage}</p>}
      <h4>Comments</h4>
      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              <strong>{comment.username}</strong> : {comment.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostDetail;
