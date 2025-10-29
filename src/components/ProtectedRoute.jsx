import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const session = JSON.parse(localStorage.getItem("ticketapp_session"));

  if (!session) {
    return <Navigate to="/authentication" replace />;
  }

  return children;
};

export default ProtectedRoute;