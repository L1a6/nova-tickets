import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const session = JSON.parse(localStorage.getItem("ticketapp_session"));

  // Check if session exists — you don’t need "token" unless you actually set one
  if (!session) {
    return <Navigate to="/authentication" replace />;
  }

  // Otherwise, show protected content
  return children;
};

export default ProtectedRoute;