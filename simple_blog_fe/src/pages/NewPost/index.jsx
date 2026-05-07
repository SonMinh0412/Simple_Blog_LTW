import { useState } from "react";
import { useForm } from "react-hook-form";
export default function NewPost() {
  const [newPost, setNewPost] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    const post = JSON.stringify(data);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/post", {
        method: "POST",
        // credentials: "include",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: post,
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status : ${res.status}`);
      }
      reset();
      setNewPost("Post created successfully !");
    } catch (error) {
      console.log("Error creating data: ", error);
      setNewPost("Post created failed !");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div style={{ padding: 10 }}>
        <span>Slug: </span>
        <input type="text" {...register("slug", { required: true })} />
        {errors.slug && <div style={{ color: "red" }}>Slug is required</div>}
        <br />
        <span>Title: </span>
        <input type="text" {...register("title", { required: true })} />
        {errors.title && <div style={{ color: "red" }}>Title is required</div>}
        <br />
        <span>Description: </span>
        <input type="text" {...register("description", { required: true })} />
        {errors.description && (
          <div style={{ color: "red" }}>Description is required</div>
        )}
        <br />
        <button type="submit">Add new post</button>
        <p className="text-success">{newPost}</p>
      </div>
    </form>
  );
}
