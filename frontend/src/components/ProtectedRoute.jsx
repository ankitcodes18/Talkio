import React from 'react'
import { useAuth } from '../context/Authcontext';
import { Navigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({children}) => {

  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  console.log(user);
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
