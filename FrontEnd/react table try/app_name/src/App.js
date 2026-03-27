import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import { theme } from './theme';
import UserList from './components/UserList';
import Home from './Home';
import Sidebar from './components/Sidebar';
import TopBar from './components/Topbar';
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

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = window.innerWidth <= 600;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 600) {
        setSidebarOpen(true); // Keep sidebar open on desktop
      } else {
        setSidebarOpen(false); // Close sidebar on mobile
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call it once on mount to set initial state
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        component="div"
        sx={{ 
          display: 'flex',
          minHeight: '100vh',
          maxWidth: '100vw',
          bgcolor: 'background.default',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Sidebar 
          open={sidebarOpen} 
          onClose={closeSidebar}
          isMobile={isMobile}
        />
        <Box 
          component="div"
          sx={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column',
            minWidth: 0, // Important for flex child to prevent overflow
            maxWidth: '100%',
            position: 'relative'
          }}
        >
          <TopBar 
            onMenuClick={toggleSidebar} 
            darkMode={darkMode} 
            toggleDarkMode={toggleDarkMode}
            isMobile={isMobile}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 1, sm: 2 },
              ml: { 
                xs: 0,
                sm: sidebarOpen ? '0px' : 0,
                md: sidebarOpen ? '0px' : 0
              },
              width: {
                xs: '100%',
                sm: sidebarOpen ? 'calc(100% - 240px)' : '100%',
                md: sidebarOpen ? 'calc(100% - 280px)' : '100%'
              },
              transition: theme => theme.transitions.create(
                ['margin', 'width'],
                {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.standard,
                }
              ),
              minHeight: 'calc(100vh - 4rem)',
              bgcolor: 'background.default',
              overflow: 'auto',
              '& .MuiPaper-root': {
                maxWidth: '100%',
              },
              '& .MuiContainer-root': {
                maxWidth: '100%',
              }
            }}
          >
            <Box 
              sx={{ 
                mt: { xs: '3.5rem', sm: '4rem' },
                maxWidth: '100%',
                '& > *': {
                  maxWidth: '100%',
                  overflow: 'auto'
                }
              }}
            >  {/* Toolbar spacer with zoom handling */}
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
                <Route path="*" element={
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h4" color="error">Page Not Found</Typography>
                  </Box>
                } />
              </Routes>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
