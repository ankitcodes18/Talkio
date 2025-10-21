import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from '../context/Authcontext';

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const handleSubmit = async(e) => {
    e.preventDefault();
    

  try {
    const res = await axios.post(
      "http://localhost:3000/signup",
      { username, password },
      { withCredentials: true }
    );

    console.log("login Succesfiulll")
    toast.success("Signup successful!");
    setUser(res.data);
    navigate("/chat");
      
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log("User already exists");
      toast.error(error.response.data || "User already exists");
    } else {
      console.error(error);
      toast.error("Unexpected error occurred");
    }
  }


  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 w-full max-w-md shadow-lg text-white">
        
        <h2 className="text-3xl font-bold mb-6 text-center drop-shadow-lg">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 placeholder-white/70 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/20 placeholder-white/70 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
            required
          />
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-lg font-semibold shadow-lg transition transform hover:-translate-y-1"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-white/80 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-semibold hover:underline">
            Login
          </Link>
        </p>

      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SignUpPage;
