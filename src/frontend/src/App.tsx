import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ExamCategory, Subject } from "./hooks/useQueries";
import { AdminPage } from "./pages/AdminPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { MockTestsPage } from "./pages/MockTestsPage";
import { PracticePage } from "./pages/PracticePage";
import { ProgressPage } from "./pages/ProgressPage";
import { StudyNotesPage } from "./pages/StudyNotesPage";
import type { Page } from "./types";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedCategory, setSelectedCategory] = useState<ExamCategory>(
    ExamCategory.rimc,
  );
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.math);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
