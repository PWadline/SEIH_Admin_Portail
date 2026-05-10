// src/components/layout/AuthLayout.jsx
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1e293b] to-[#475569]">
      <Outlet />
    </div>
  );
};

export default AuthLayout;