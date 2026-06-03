import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <div className="p-4 bg-gray-100 flex-1 overflow-y-auto">
          {children}
        </div>

      </div>
    </div>
  );
}

export default MainLayout;