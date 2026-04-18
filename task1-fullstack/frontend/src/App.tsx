import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { CampaignListPage } from "./pages/CampaignListPage.js";
import { LandingPage } from "./pages/LandingPage.js";
import { SubmissionsPage } from "./pages/SubmissionsPage.js";

export function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <nav
          className="flex gap-7 border-b-2 border-ink bg-surface px-6 py-4"
          aria-label="Main"
        >
          <Link
            className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-ink no-underline hover:underline hover:underline-offset-4"
            to="/"
          >
            Campaigns
          </Link>
          <Link
            className="text-[0.78rem] font-bold uppercase tracking-[0.08em] text-ink no-underline hover:underline hover:underline-offset-4"
            to="/submissions"
          >
            Submissions
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<CampaignListPage />} />
          <Route path="/landing/:slug" element={<LandingPage />} />
          <Route path="/submissions" element={<SubmissionsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
