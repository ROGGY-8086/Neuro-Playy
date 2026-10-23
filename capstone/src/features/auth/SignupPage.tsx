import React from 'react';
import { CaregiverSignupPage } from './CaregiverSignupPage';

/**
 * Backward compatibility wrapper for generic /signup route.
 * Redirects or delegates to CaregiverSignupPage.
 */
export const SignupPage: React.FC = () => {
  return <CaregiverSignupPage />;
};

export default SignupPage;
