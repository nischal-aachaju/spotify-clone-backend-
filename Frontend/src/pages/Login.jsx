import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
        { withCredentials: true } // important if using cookies (JWT)
      );

      setMessage("Login successful ✅");
      console.log(response.data);

      // Reset form
      setFormData({
        username: "",
        email: "",
        role: "user",
        password: "",
      });

    } catch (error) {
      setMessage("Login failed ❌");
      console.log(error.response?.data);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-6 border rounded w-80 shadow"
      >
        <h2 className="text-xl mb-4">Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full mb-3 p-2 border"
          
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border"
          
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-3 p-2 border"
        >
          <option value="user">User</option>
          <option value="artist">Artist</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-3 p-2 border"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2"
        >
          Login
        </button>

        {message && (
          <p className="mt-3 text-center">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Login;

