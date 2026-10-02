import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotification } from "@/context/NotificationContext";
import { User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSubscription } from "@/context/SubscriptionContext";

export function Header() {
  const navigate = useNavigate();
  const { sidebarOpen, setSidebarOpen } = useAppContext();
  const { user, logout } = useAuth();
  const { notifications, removeNotification, clearAll } = useNotification();
  const unreadCount = notifications.length;
  const getRemainingDays = () => {

  if (!trialEndsAt) return 0;

  const now = new Date();

  const end = new Date(trialEndsAt);

  const diff =
    end.getTime() - now.getTime();

  return Math.max(
    Math.ceil(
      diff / (1000 * 60 * 60 * 24)
    ),
    0
  );
};
  const { selectedPlan,subscriptionStatus,trialEndsAt,} = useSubscription();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-[hsl(var(--card))] px-6 shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
        >
          <Menu size={20} />
        </button>
      </div>
      <div className="flex items-center gap-2">
       {
  subscriptionStatus === "trial" && (
    <div className="px-3 py-1 rounded-full bg-lime-500/20 text-lime-400 text-xs font-medium border border-lime-500/30">

      {selectedPlan} Trial •{" "}

      {getRemainingDays()} days left

    </div>
  )
}
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-semibold">Notifications</span>
              {notifications.length > 0 && (
                <button
                  onClick={() => clearAll()}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="px-3 py-3 text-sm text-muted-foreground">No new notifications</div>
            ) : (
              notifications.map(notification => (
                <DropdownMenuItem
                  key={notification.id}
                  onSelect={() => removeNotification(notification.id)}
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium">{notification.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {notification.message && (
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </span>
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggleButton />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="rounded-full p-0 h-10 w-10 overflow-hidden ml-2"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.name ?? "User"} />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map(n => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col space-y-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
              <span className="inline-block w-fit text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                {user?.role}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick} className="gap-2 cursor-pointer">
              <User className="h-4 w-4" />
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 text-red-600 dark:text-red-400 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
