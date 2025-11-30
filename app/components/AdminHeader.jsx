"use client";
import React from "react";
import { useRouter } from "next/navigation";

const AdminHeader = () => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminUsername");
    router.push("/admin/login");
  };
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 ">
      <div className="">
        <h1 className="text-3xl font-bold mb-2 text-[#F8F8F8]">Admin Dashboard</h1>
        <p className="text-sm text-[#F8F8F8]">
          Welcome back
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="px-6 py-2 rounded-lg font-medium transition-all duration-300"
        style={{
          backgroundColor: "#761e1e",
          color: "#FFFFFF",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#761e1e";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#761e1e";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminHeader;
