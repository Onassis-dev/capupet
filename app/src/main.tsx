import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "@workspace/ui/globals.css";

// Layouts
import RootLayout from "./layouts/RootLayout";
import ErrorView from "./components/ErrorView";
import ErrorBoundary from "./components/ErrorBoundary";
import { NotFoundPage } from "./components/ErrorView";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Auth routes
import SignInPage from "./routes/auth/signin";
import SignUpPage from "./routes/auth/signup";
import ForgotPasswordPage from "./routes/auth/forgot-password";
import ResetPasswordPage from "./routes/auth/reset-password";
import VerifyEmailPage from "./routes/auth/verify-email";
import OnboardingPage from "./routes/auth/onboarding";
import OfflinePage from "./routes/auth/offline";

// Dashboard routes
import DashboardPage from "./routes/dashboard/index";
import PetsPage from "./routes/dashboard/pets/index";
import PetDetailPage from "./routes/dashboard/pets/[id]/index";
import AdoptersPage from "./routes/dashboard/adopters/index";
import TasksPage from "./routes/dashboard/tasks/index";
import WebsitePage from "./routes/dashboard/website/index";
import SettingsPage from "./routes/dashboard/settings/index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<RootLayout />} errorElement={<ErrorView />}>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/offline" element={<OfflinePage />} />
            </Route>

            {/* Dashboard routes */}
            <Route element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="pets" element={<PetsPage />} />
              <Route path="pets/:id" element={<PetDetailPage />} />
              <Route path="adopters" element={<AdoptersPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="website" element={<WebsitePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Redirect root to dashboard */}
            <Route element={<Navigate to="/dashboard" replace />} />

            {/* Catch unmatched routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
