import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function PostDetail({ user }) {
  const [post, setPost] = useState();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [editingCommentId, setEditingCommentId] = useState();
  const [editingCommentText, setEditingCommentText] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/posts/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8080/api/posts/${slug}/comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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
  async function handleDeletePost() {
    const confirmed = window.confirm("Delete this post ?");
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/posts/${slug}`, {
        method: "DELETE",
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/posts/${slug}/comments`,
        {
          method: "POST",
          // credentials: "include",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
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
  async function handleEditComment(commentId) {
    setCommentMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/posts/${slug}/comments/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editingCommentText }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setCommentMessage(data.message || "Update comment failed");
        return;
      }
      setComments((currentComments) =>
        currentComments.map((comment) =>
          comment._id === commentId ? data : comment,
        ),
      );
      setEditingCommentId(null);
      setEditingCommentText("");
    } catch (error) {
      console.log(error);
      setCommentMessage("Update comment failed");
    }
  }
  async function handleDeleteComment(commentId) {
    const confirmed = window.confirm("Delete this comment ?");
    if (!confirmed) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8080/api/posts/${slug}/comments/${commentId}`,
        {
          method: "DELETE",
          // credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        setCommentMessage("Delete comment failed");
        return;
      }
      setComments((currentComments) =>
        currentComments.filter((comment) => comment._id !== commentId),
      );
    } catch (error) {
      console.error("Deleting error: ", error);
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
      <button type="button" onClick={handleDeletePost}>
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
              <strong>{comment.username}</strong> :{" "}
              {editingCommentId === comment._id ? (
                <>
                  <input
                    type="text"
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleEditComment(comment._id)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingCommentText("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {comment.content}
                  {comment.username === user?.username && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditingCommentText(comment.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostDetail;
