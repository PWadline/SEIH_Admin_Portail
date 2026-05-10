// src/components/layout/MainLayout.jsx
import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e293b] to-[#475569] dark:from-white dark:to-[#7F9AE5]/80">
      <Header />
      <Sidebar />

      <main className="flex-1 p-4 overflow-y-auto mt-[110px]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;