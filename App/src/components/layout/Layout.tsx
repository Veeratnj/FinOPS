import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom"; // ✅ ADD THIS

export function Layout() {
  const { sidebarOpen } = useAppContext();

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-foreground">
      <Sidebar />
      <div className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-16")}> 
        <Header />

        <main className="animate-fade-in min-h-[calc(100vh-4rem)] overflow-x-hidden overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(124,255,0,0.08),_transparent_35%)] px-3 py-4 sm:px-4 lg:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}