import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ErrorBoundary from "@/components/feedback/ErrorBoundary";
import Toaster from "@/components/feedback/Toaster";

/** Kerangka bersama semua halaman: navbar tetap tampil walau satu halaman error. */
export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl p-6">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Toaster />
    </div>
  );
}
