import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setMessage("");
    setMessageType("");

    const user = {
      username: data.username,
      password: data.password,
    };

    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.message || `HTTP error! Status: ${res.status}`);
      }

      reset();
      setMessage("User created successfully. Redirecting to login...");
      setMessageType("success");
      setTimeout(() => navigate("/login"), 800);
    } catch (error) {
      console.log("Error creating data: ", error);
      setMessage(error.message || "User created failed!");
      setMessageType("error");
    }
  };

  return (
    <>
      <h1>This is Register Page !</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ padding: 10 }}>
          <span>Username: </span>
          <input type="text" {...register("username", { required: true })} />
          {errors.username && (
            <div style={{ color: "red" }}>Username is required</div>
          )}
          <br />
          <span>Password: </span>
          <input
            type="password"
            {...register("password", {
              required: true,
              minLength: {
                value: 6,
                message: "Password must have at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <div style={{ color: "red" }}>
              {errors.password.message || "Password is required"}
            </div>
          )}
          <br />
          <span>Confirm Password: </span>
          <input
            type="password"
            {...register("confirmPassword", {
              required: true,
            })}
          />
          {errors.confirmPassword && (
            <div style={{ color: "red" }}>Confirm password is required</div>
          )}
          <br />
          <button type="submit">Register</button>
          {message && (
            <p style={{ color: messageType === "success" ? "green" : "red" }}>
              {message}
            </p>
          )}
        </div>
      </form>
    </>
  );
}
