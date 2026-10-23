import React from 'react';
import { CaregiverLoginPage } from './CaregiverLoginPage';

/**
 * Backward compatibility wrapper for generic /login route.
 * Redirects or delegates to CaregiverLoginPage.
 */
export const LoginPage: React.FC = () => {
  return <CaregiverLoginPage />;
};

export default LoginPage;
