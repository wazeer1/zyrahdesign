import AdminHeader from "../components/AdminHeader";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* <AdminHeader /> */}

      <div className="flex flex-1">
        {/* <div className="w-64 bg-gray-800 text-white">
          <AdminSidebar />
        </div> */}

        {/* Content area */}
        <main className="flex-1 bg-gray-100 ">
          {children}
        </main>
      </div>
    </div>
  );
}
