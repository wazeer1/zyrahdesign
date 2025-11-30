import AdminHeader from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Header */}
      <AdminHeader />

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white">
          <AdminSidebar />
        </div>

        {/* Content area */}
        <main className="flex-1 bg-gray-100 p-6 max-h-[calc(100vh-74px)] overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}
