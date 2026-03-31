import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';

import { useTranslation } from 'react-i18next';

export default function TopBar({
  onMenuClick,
  darkMode,
  toggleDarkMode,
  topbarHeight = 64,
  isMobile: isMobileProp,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (typeof isMobileProp === 'boolean') {
      setIsMobile(isMobileProp);
      return undefined;
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileProp]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClick = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMoreMenuAnchor(null);
  };

  const handleLogout = () => {
    alert(t('logoutClicked'));
    handleClose();
  };

  const [language, setLanguage] = useState(i18n.language || localStorage.getItem('language') || 'en');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    localStorage.setItem('language', lng);
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: '#ffffff',
        borderBottom: '1px solid #e6e6e6',
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
        width: '100%',
        left: 0,
        right: 0,
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          minHeight: { xs: 56, sm: topbarHeight },
          px: { xs: 1, sm: 2.5 }
        }}
      >
        {/* Left section with menu icon and title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{
              color: '#0f172a',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              '&:hover': {
                backgroundColor: '#f8fafc',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              ml: 2,
              color: '#0f172a',
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              display: { xs: 'none', sm: 'block' },
              letterSpacing: '-0.03em',
            }}
          >
            {t('milkManagement') || 'Milk Management'}
          </Typography>
        </Box>

        {/* Right section with controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 2 } }}>
          {/* Desktop controls */}
          {!isMobile && (
            <>
              <Select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                size="small"
                sx={{
                  minWidth: 100,
                  fontSize: '0.875rem',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  '& .MuiSelect-select': {
                    py: 0.9,
                    color: '#0f172a',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(148,163,184,0.24)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(37,99,235,0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2563eb',
                    borderWidth: '1px',
                  },
                }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="hi">हिंदी</MenuItem>
                <MenuItem value="mr">मराठी</MenuItem>
              </Select>

              <Switch 
                checked={darkMode} 
                onChange={toggleDarkMode}
                size="small" 
                sx={{
                  '& .MuiSwitch-thumb': {
                    backgroundColor: '#ffffff',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#2563eb',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#2563eb',
                    opacity: 0.4,
                  },
                }}
              />
            </>
          )}

          {/* Mobile more menu */}
          {isMobile && (
            <>
              <IconButton
                size="small"
                onClick={handleMoreClick}
                sx={{ 
                  color: '#0f172a',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={moreMenuAnchor}
                open={Boolean(moreMenuAnchor)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    backgroundColor: '#ffffff',
                    border: '1px solid #e6e6e6',
                    borderRadius: '12px',
                    mt: 1,
                    minWidth: 150,
                    boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
                    '& .MuiMenuItem-root': {
                      fontSize: '0.875rem',
                      color: '#0f172a',
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(37,99,235,0.08)',
                      },
                    },
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <Box sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    gap: 2,
                  }}>
                    <Typography variant="body2">{t('darkMode') || 'Dark Mode'}</Typography>
                    <Switch
                      checked={darkMode}
                      onChange={toggleDarkMode}
                      size="small"
                    />
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('en')}>
                  <ListItemText primary="English" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  {language === 'en' && <CheckIcon fontSize="small" sx={{ ml: 1 }} />}
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('hi')}>
                  <ListItemText primary="हिंदी" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  {language === 'hi' && <CheckIcon fontSize="small" sx={{ ml: 1 }} />}
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('mr')}>
                  <ListItemText primary="मराठी" primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  {language === 'mr' && <CheckIcon fontSize="small" sx={{ ml: 1 }} />}
                </MenuItem>
              </Menu>
            </>
          )}

          {/* User menu */}
          <IconButton
            size="small"
            onClick={handleAvatarClick}
            sx={{
              p: 0.5,
              borderRadius: '10px',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              '&:hover': {
                backgroundColor: '#f8fafc',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <Avatar 
              sx={{ 
                width: { xs: 28, sm: 32 }, 
                height: { xs: 28, sm: 32 },
                background: 'linear-gradient(135deg, #2563eb, #60a5fa)',
                fontSize: '0.875rem',
                fontWeight: 700,
                boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)',
              }}
            >
              U
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                backgroundColor: '#ffffff',
                border: '1px solid #e6e6e6',
                borderRadius: '12px',
                mt: 1,
                minWidth: 180,
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)',
                '& .MuiMenuItem-root': {
                  fontSize: '0.875rem',
                  color: '#0f172a',
                  py: 1,
                  transition: 'background-color 0.2s ease, transform 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(37,99,235,0.08)',
                    transform: 'translateX(2px)',
                  },
                },
                '& .MuiListItemIcon-root': {
                  color: '#64748b',
                  minWidth: '32px',
                },
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('profile') || 'Profile'} />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('settings') || 'Settings'} />
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: '#ef4444 !important' }}>
              <ListItemIcon sx={{ color: '#ef4444' }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('logout') || 'Logout'} />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
