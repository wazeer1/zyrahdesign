"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  { key: "category", label: "Categories", route: "/admin/category" },
  { key: "product", label: "Products", route: "/admin" },
  { key: "lookbook", label: "Lookbook", route: "/admin/lookbook" },
];

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname(); // current route

  return (
    <div className="w-64 h-[calc(100vh-64px)] bg-gray-800 text-white flex flex-col p-4">
      {menuItems.map((item) => {
        const isActive = pathname === item.route;
        return (
          <button
            key={item.key}
            className={`text-left px-4 py-2 mb-2 rounded w-full ${
              isActive ? "bg-gray-600 font-semibold" : "hover:bg-gray-700"
            }`}
            onClick={() => router.push(item.route)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default AdminSidebar;
