import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingChoicePage } from './features/landing/LandingChoicePage';
import { PlayerActivityHome } from './features/player/PlayerActivityHome';
import { CaregiverLoginPage } from './features/auth/CaregiverLoginPage';
import { CaregiverSignupPage } from './features/auth/CaregiverSignupPage';
import { PatientLoginPage } from './features/auth/PatientLoginPage';
import { PatientSignupPage } from './features/auth/PatientSignupPage';
import { CaregiverDashboardPage } from './features/dashboard/CaregiverDashboardPage';
import { GuardianProfileSetupPage } from './features/guardian/GuardianProfileSetupPage';
import { DailyMemoryGamePage } from './features/game/DailyMemoryGamePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Choice Page */}
        <Route path="/" element={<LandingChoicePage />} />
        <Route path="/welcome" element={<LandingChoicePage />} />

        {/* Patient / Player Activity Space */}
        <Route path="/player" element={<PlayerActivityHome />} />

        {/* Caregiver Authentication Routes */}
        <Route path="/caregiver/login" element={<CaregiverLoginPage />} />
        <Route path="/caregiver/signup" element={<CaregiverSignupPage />} />
        {/* Backward-compatibility aliases */}
        <Route path="/login" element={<Navigate to="/caregiver/login" replace />} />
        <Route path="/signup" element={<Navigate to="/caregiver/signup" replace />} />

        {/* Patient Authentication Routes */}
        <Route path="/patient/login" element={<PatientLoginPage />} />
        <Route path="/patient/signup" element={<PatientSignupPage />} />

        {/* Protected Caregiver Management Dashboard */}
        <Route
          path="/caregiver/dashboard"
          element={
            <ProtectedRoute requiredRole="CAREGIVER">
              <CaregiverDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="CAREGIVER">
              <CaregiverDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Guardian Profile Setup & Daily Memory Game */}
        <Route
          path="/guardian/setup"
          element={
            <ProtectedRoute>
              <GuardianProfileSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guardian-setup"
          element={<Navigate to="/guardian/setup" replace />}
        />
        <Route
          path="/daily-game"
          element={
            <ProtectedRoute>
              <DailyMemoryGamePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-memory-game"
          element={<Navigate to="/daily-game" replace />}
        />

        {/* Fallback to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
