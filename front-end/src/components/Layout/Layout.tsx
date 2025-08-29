import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Example: Navbar or Sidebar */}
      {/* <Navbar /> */}

      {/* Routed pages will be injected here */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* <Footer /> */}
    </div>
  );
}