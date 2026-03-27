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

export default function TopBar({ onMenuClick, darkMode, toggleDarkMode }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const [language, setLanguage] = useState(i18n.language || 'en');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) => theme.palette.background.paper,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2 }
        }}
      >
        {/* Left section with menu icon and title */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{
              color: 'text.primary',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            component="div" 
            sx={{ 
              ml: 1,
              color: 'text.primary',
              fontWeight: 600,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            {t('milkManagement')}
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
                  '& .MuiSelect-select': {
                    py: 0.5,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
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
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'primary.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'primary.main',
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
                sx={{ color: 'text.primary' }}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={moreMenuAnchor}
                open={Boolean(moreMenuAnchor)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 2,
                  sx: {
                    mt: 1.5,
                    minWidth: 150,
                    borderRadius: 1,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
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
                    alignItems: 'center' 
                  }}>
                    <Typography variant="body2">{t('darkMode')}</Typography>
                    <Switch
                      checked={darkMode}
                      onChange={toggleDarkMode}
                      size="small"
                    />
                  </Box>
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('en')}>
                  <ListItemText primary="English" />
                  {language === 'en' && <CheckIcon fontSize="small" sx={{ ml: 1 }} />}
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('hi')}>
                  <ListItemText primary="हिंदी" />
                  {language === 'hi' && <CheckIcon fontSize="small" sx={{ ml: 1 }} />}
                </MenuItem>
                <MenuItem onClick={() => changeLanguage('mr')}>
                  <ListItemText primary="मराठी" />
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
              p: 0,
              border: '2px solid',
              borderColor: 'primary.main',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'primary.dark',
                transform: 'scale(1.05)',
              },
            }}
          >
            <Avatar 
              sx={{ 
                width: { xs: 28, sm: 32 }, 
                height: { xs: 28, sm: 32 },
                bgcolor: 'primary.main' 
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
              elevation: 2,
              sx: {
                mt: 1.5,
                minWidth: 180,
                borderRadius: 1,
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                '& .MuiMenuItem-root': {
                  py: 1,
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
              <ListItemText primary={t('profile')} />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={t('settings')} />
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primary={t('logout')} sx={{ color: 'error.main' }} />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}