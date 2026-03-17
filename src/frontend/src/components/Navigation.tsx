import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  BookOpen,
  ClipboardList,
  Crown,
  FileText,
  GraduationCap,
  Home,
  Image,
  LogIn,
  LogOut,
  Menu,
  Settings,
  Shield,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";
import type { Page } from "../types";

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS = [
  { page: "home" as Page, label: "Home", icon: Home, marker: "nav.home_link" },
  {
    page: "practice" as Page,
    label: "Practice",
    icon: BookOpen,
    marker: "nav.practice_link",
  },
  {
    page: "mock-tests" as Page,
    label: "Mock Tests",
    icon: ClipboardList,
    marker: "nav.mock_tests_link",
  },
  {
    page: "notes" as Page,
    label: "Study Notes",
    icon: FileText,
    marker: "nav.notes_link",
  },
  {
    page: "leaderboard" as Page,
    label: "Leaderboard",
    icon: Trophy,
    marker: "nav.leaderboard_link",
  },
  {
    page: "progress" as Page,
    label: "My Progress",
    icon: BarChart2,
    marker: "nav.progress_link",
  },
  {
    page: "pricing" as Page,
    label: "Pricing",
    icon: Crown,
    marker: "nav.pricing_link",
  },
  {
    page: "poster" as Page,
    label: "Poster",
    icon: Image,
    marker: "nav.poster_link",
  },
];

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !!identity;

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-military border-b border-navy-700/50 shadow-military">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <button
              type="button"
              onClick={() => handleNav("home")}
              className="flex items-center gap-2.5 group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-saffron-400/20 border border-saffron-400/30 group-hover:bg-saffron-400/30 transition-colors">
                <Shield className="w-5 h-5 text-saffron-400" />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white leading-none block">
                  Sainik Prep
                </span>
                <span className="text-[10px] text-navy-200 font-body leading-none tracking-wider uppercase">
                  Exam Excellence
                </span>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ page, label, icon: Icon, marker }) => (
                <button
                  type="button"
                  key={page}
                  data-ocid={marker}
                  onClick={() => handleNav(page)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "bg-saffron-400/20 text-saffron-400 border border-saffron-400/30"
                      : "text-navy-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
              <button
                type="button"
                data-ocid="nav.admin_link"
                onClick={() => handleNav("admin")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === "admin"
                    ? "bg-saffron-400/20 text-saffron-400 border border-saffron-400/30"
                    : "text-navy-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
            </nav>

            {/* Auth */}
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Badge className="hidden md:flex bg-saffron-400/20 text-saffron-400 border-saffron-400/30 text-xs">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
              {isLoggedIn ? (
                <Button
                  data-ocid="nav.logout_button"
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="hidden md:flex items-center gap-1.5 border-white/20 text-white hover:bg-white/10 bg-transparent text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <Button
                  data-ocid="nav.login_button"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="hidden md:flex items-center gap-1.5 bg-saffron-400 hover:bg-saffron-500 text-navy-900 font-semibold text-sm border-0"
                >
                  <LogIn className="w-4 h-4" />
                  {isLoggingIn ? "Logging in..." : "Login"}
                </Button>
              )}

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-navy-900 border-b border-navy-700/50 shadow-lg"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map(({ page, label, icon: Icon, marker }) => (
                <button
                  type="button"
                  key={page}
                  data-ocid={marker}
                  onClick={() => handleNav(page)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                    currentPage === page
                      ? "bg-saffron-400/20 text-saffron-400"
                      : "text-navy-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
              <button
                type="button"
                data-ocid="nav.admin_link"
                onClick={() => handleNav("admin")}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                  currentPage === "admin"
                    ? "bg-saffron-400/20 text-saffron-400"
                    : "text-navy-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <Settings className="w-4 h-4" />
                Admin
              </button>
              <div className="pt-2 border-t border-navy-700/50">
                {isLoggedIn ? (
                  <button
                    type="button"
                    data-ocid="nav.logout_button"
                    onClick={() => {
                      clear();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-navy-200 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    data-ocid="nav.login_button"
                    onClick={() => {
                      login();
                      setMobileOpen(false);
                    }}
                    disabled={isLoggingIn}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium bg-saffron-400/20 text-saffron-400 hover:bg-saffron-400/30 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
