import { Link, Outlet } from "react-router-dom";
import type { Role } from "../types";

type User = {
  id: number;
  email: string;
  role: "Student" | "Tutor" | "Vice_Dean" | string;
  firstName?: string;
  lastName?: string;
};

export default function Layout() {
  const stored = localStorage.getItem("user");
  const user: User | null = stored ? (JSON.parse(stored) as User) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow">
        <h1 className="font-bold text-xl">STS - Thesis System</h1>
        <nav className="space-x-6">
          <Link to={user?.role && normalizeRole(user.role) === "Student" ? "/student/dashboard" : "/auth"} className="hover:underline">
            Dashboard
          </Link>
          <button
            className="hover:underline"
            onClick={() => {
              localStorage.removeItem("user");
              // redirect to auth (SPA path)
              window.location.href = "/auth";
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Routed content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 p-4 text-center text-gray-600">
        © {new Date().getFullYear()} Technical University of Sofia
      </footer>
    </div>
  );
}

export function normalizeRole(role?: string): Role | "" {
  if (!role) return "";
  const r = role.toLowerCase();
  if (r === "student") return "Student";
  if (r === "tutor") return "Tutor";
  if (r === "vice_dean" || r === "vice-dean" || r === "vice dean") return "Vice_Dean";
  return role as Role;
}