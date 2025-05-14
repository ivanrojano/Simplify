// src/components/PrivateRoute.tsx
import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const { token, role } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role || "")) return <Navigate to="/unauthorized" />;

  return children;
};

export default PrivateRoute;
