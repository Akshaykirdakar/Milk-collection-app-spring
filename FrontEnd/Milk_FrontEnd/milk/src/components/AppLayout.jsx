import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './Topbar';

const SIDEBAR_EXPANDED_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const TOPBAR_HEIGHT = 64;

export default function AppLayout({ children, darkMode, toggleDarkMode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };


  const sidebarWidth = isMobile
    ? SIDEBAR_EXPANDED_WIDTH
    : sidebarOpen
      ? SIDEBAR_EXPANDED_WIDTH
      : SIDEBAR_COLLAPSED_WIDTH;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <TopBar
        onMenuClick={toggleSidebar}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isMobile={isMobile}
        topbarHeight={TOPBAR_HEIGHT}
      />

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          pt: `${TOPBAR_HEIGHT}px`,
        }}
      >
        <Sidebar
          open={sidebarOpen}
          onClose={closeSidebar}
          isMobile={isMobile}
          sidebarWidth={sidebarWidth}
          collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
          topbarHeight={TOPBAR_HEIGHT}
        />

        
        <Box
  component="main"
  sx={{
    flex: 1,
    minWidth: 0,
    overflowY: 'auto',
    overflowX: 'hidden',

    mt: `5px`,

    // ✅ THIS IS THE REAL FIX
    ml: isMobile ? 0 : `5px`,

    p: 2,

    display: 'flex',
    justifyContent: 'center',   // center content nicely
    alignItems: 'flex-start',

    transition: 'margin-left 0.3s ease',
  }}
>
          <Box
            sx={{
              width: 'min(100%, 1232px)',
              minWidth: 0,
              transition: 'max-width 0.3s ease, width 0.3s ease',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
