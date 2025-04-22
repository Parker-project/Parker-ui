import React from 'react';
import LoginScreen from '../screens/LoginScreens';
import ReportSubmissionScreen from '../screens/ReportScreen';

export default function App() {
  const DEV_PREVIEW = true;  // flip this to false to go back to login
  return DEV_PREVIEW
    ? <ReportSubmissionScreen />
    : <LoginScreen />;
}
