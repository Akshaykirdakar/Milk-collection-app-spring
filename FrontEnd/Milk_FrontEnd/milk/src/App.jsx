import React, { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getTheme } from './theme';
import AppLayout from './components/AppLayout';
import UserList from './components/UserList';
import Home from './Home';
import AddUser from './components/AddUser';
import UserDisplay from './components/UserProfile';
import MilkCollection from './components/MilkCollection';
import MilkRateSlabs from './components/MilkRateSlabs';
import GenerateMilkRates from './components/GenerateMilkRates';
import MilkRateChart from './components/MilkRateChart';
import ReportGenerator from './components/ReportGenerator';
import ReportSettings from './components/ReportSetting';
import MilkReportPage from './components/MilkReportPage';
import MilkReportSettings from './components/MilkReportSettings';
import './App.css';

function AppContent({ darkMode, toggleDarkMode }) {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route
        path="*"
        element={
          <AppLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/user/:id" element={<UserDisplay />} />
              <Route path="/milkCollection" element={<MilkCollection />} />
              <Route path="/milkRateSlabs" element={<MilkRateSlabs />} />
              <Route path="/generateMilkRates" element={<GenerateMilkRates />} />
              <Route path="/milkRateChart" element={<MilkRateChart />} />
              <Route path="/reportGenerator" element={<ReportGenerator />} />
              <Route path="/reportSetting" element={<ReportSettings />} />
              <Route path="/milkReportPage" element={<MilkReportPage />} />
              <Route path="/milkReportSettings" element={<MilkReportSettings />} />
              <Route
                path="*"
                element={
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h4" color="error">
                      {t('pageNotFound')}
                    </Typography>
                  </Box>
                }
              />
            </Routes>
          </AppLayout>
        }
      />
    </Routes>
  );
}

export default function App() {
  // Initialize dark mode from localStorage, default to false (light mode)
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </BrowserRouter>
    </ThemeProvider>
  );
}