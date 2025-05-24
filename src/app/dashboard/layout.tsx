import { ReactNode } from "react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: "20%", background: "#222", color: "#fff", padding: "1rem" }}>
        <h2>Dashboard</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link href="/dashboard">Home</Link>
          <Link href="/dashboard/about">About</Link>
          <Link href="/dashboard/contact">Contact</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ width: "80%", padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
