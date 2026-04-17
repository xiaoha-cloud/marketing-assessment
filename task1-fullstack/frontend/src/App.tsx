import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { CampaignListPage } from "./pages/CampaignListPage.js";
import { LandingPage } from "./pages/LandingPage.js";
import { SubmissionsPage } from "./pages/SubmissionsPage.js";

export function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <nav className="app-nav" aria-label="Main">
          <Link to="/">Campaigns</Link>
          <Link to="/submissions">Submissions</Link>
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
