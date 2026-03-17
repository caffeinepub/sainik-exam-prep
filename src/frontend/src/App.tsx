import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Navigation } from "./components/Navigation";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ExamCategory, Subject } from "./hooks/useQueries";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { MockTestsPage } from "./pages/MockTestsPage";
import { PaymentFailure } from "./pages/PaymentFailure";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PosterPage } from "./pages/PosterPage";
import { PracticePage } from "./pages/PracticePage";
import { PricingPage } from "./pages/PricingPage";
import { ProgressPage } from "./pages/ProgressPage";
import { StudyNotesPage } from "./pages/StudyNotesPage";
import type { Page } from "./types";

function getInitialPage(): Page {
  const path = window.location.pathname;
  if (path === "/payment-success") return "payment-success";
  if (path === "/payment-failure") return "payment-failure";
  if (path === "/pricing") return "pricing";
  return "home";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage);
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>(
    ExamCategory.rimc,
  );
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.math);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    // Update browser URL for payment redirect pages
    if (page === "payment-success") {
      window.history.replaceState(null, "", "/payment-success");
    } else if (page === "payment-failure") {
      window.history.replaceState(null, "", "/payment-failure");
    } else if (page === "pricing") {
      window.history.replaceState(null, "", "/pricing");
    } else {
      window.history.replaceState(null, "", "/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectCategory = (cat: ExamCategory) => {
    setSelectedCategory(cat);
  };

  const handleSelectSubject = (subj: Subject) => {
    setSelectedSubject(subj);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onNavigate={navigate}
            onSelectCategory={handleSelectCategory}
          />
        );

      case "dashboard":
        return (
          <DashboardPage
            category={selectedCategory}
            onNavigate={navigate}
            onSelectSubject={handleSelectSubject}
          />
        );

      case "practice":
        return (
          <PracticePage
            initialCategory={selectedCategory}
            initialSubject={selectedSubject}
            onNavigate={navigate}
          />
        );

      case "mock-tests":
      case "mock-test-active":
        return (
          <MockTestsPage
            category={selectedCategory}
            onCategoryChange={handleSelectCategory}
          />
        );

      case "notes":
        return (
          <StudyNotesPage
            category={selectedCategory}
            subject={selectedSubject}
            onCategoryChange={handleSelectCategory}
            onSubjectChange={handleSelectSubject}
          />
        );

      case "leaderboard":
        return <LeaderboardPage />;

      case "progress":
        return <ProgressPage />;

      case "admin":
        return <AdminPage />;

      case "pricing":
        return <PricingPage onNavigate={navigate} />;

      case "payment-success":
        return <PaymentSuccess onNavigate={navigate} />;

      case "payment-failure":
        return <PaymentFailure onNavigate={navigate} />;

      case "poster":
        return <PosterPage />;

      default:
        return (
          <HomePage
            onNavigate={navigate}
            onSelectCategory={handleSelectCategory}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={navigate} />
      {renderPage()}
      <WhatsAppButton />
      <Toaster richColors position="top-right" />
    </div>
  );
}
