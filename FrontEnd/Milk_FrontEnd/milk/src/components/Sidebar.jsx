import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

export default function Sidebar({
  open,
  onClose,
  isMobile,
  sidebarWidth = 240,
  collapsedWidth = 72,
  topbarHeight = 64,
}) {
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const [milkMasterOpen, setMilkMasterOpen] = React.useState(true);
  const isCollapsed = !isMobile && sidebarWidth === collapsedWidth;
  const drawerWidth = isMobile ? '100%' : `${sidebarWidth}px`;
  const drawerTop = isMobile ? 0 : topbarHeight;
  const drawerHeight = isMobile ? '100vh' : `calc(100vh - ${topbarHeight}px)`;

  const handleMilkMasterClick = () => {
    setMilkMasterOpen(!milkMasterOpen);
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      anchor="left"
      open={isMobile ? open : true}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: drawerWidth,
          '&.MuiDrawer-paper': {
            width: drawerWidth,
            overflowX: 'hidden',
            borderRight: '1px solid',
            borderColor: 'divider',
          }
        }
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.palette.mode === 'dark' ? '8px 0 22px rgba(0, 0, 0, 0.55)' : '8px 0 22px rgba(15, 23, 42, 0.05)',
          overflowX: 'hidden',
          position: 'fixed',
          top: drawerTop,
          left: 0,
          height: drawerHeight,
          transition: theme.transitions.create(['width', 'transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <Box 
        sx={{ 
          overflowY: 'auto',
          overflowX: 'hidden',
          height: '100%',
          mt: 0,
          px: 0,
          pt: 0,
          pb: 0,
        }}
      >
        <List
          component="nav"
          sx={{
            '& .MuiListItemIcon-root': {
              color: theme.palette.mode === 'dark' ? '#93c5fd' : '#475569',
              minWidth: { xs: 40, sm: 45 },
              transition: 'color 0.2s ease, transform 0.2s ease',
              justifyContent: 'center',
            },
            '& .MuiListItemButton-root': {
              color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#334155',
              py: { xs: 0.95, sm: 1.15 },
              px: isCollapsed ? 1 : { xs: 1.2, sm: 2.1 },
              mx: { xs: 0.5, sm: 1 },
              mb: 0.5,
              borderRadius: '12px',
              color: '#334155',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              transition: 'transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                backgroundColor: '#f8fafc',
                boxShadow: '0 8px 18px rgba(15, 23, 42, 0.06)',
                transform: isCollapsed ? 'translateY(-1px)' : 'translateX(3px)',
                '& .MuiListItemIcon-root': {
                  color: '#2563eb',
                  transform: 'translateX(1px)',
                },
              },
              '&.Mui-selected': {
                background: 'rgba(37,99,235,0.08)',
                color: '#2563eb',
                borderLeft: 'none',
                boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.08)',
                '& .MuiListItemIcon-root': {
                  color: '#2563eb',
                },
              },
            },
            '& .MuiListItemText-primary': {
              fontSize: { xs: '0.875rem', sm: '0.95rem' },
              fontWeight: 600,
              color: 'inherit',
            },
            '& .MuiListItemText-root': {
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : 'auto',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s ease, width 0.2s ease',
            },
            '& .MuiCollapse-root': {
              backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
              borderRadius: '12px',
            },
            p: 1,
          }}
        >
        <ListItemButton 
          component={Link} 
          to="/" 
          selected={location.pathname === '/'} 
          onClick={isMobile ? onClose : undefined}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={t('home')} />
        </ListItemButton>

        <ListItemButton 
          component={Link} 
          to="/milkCollection" 
          selected={location.pathname === '/milkCollection'} 
          onClick={isMobile ? onClose : undefined}
        >
          <ListItemIcon>
            <LocalDrinkIcon />
          </ListItemIcon>
          <ListItemText primary={t('milkCollection')} />
        </ListItemButton>

        <ListItemButton 
          component={Link} 
          to="/users" 
          selected={location.pathname === '/users'} 
          onClick={isMobile ? onClose : undefined}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary={t('users')} />
        </ListItemButton>

        <ListItemButton 
          component={Link} 
          to="/add-user" 
          selected={location.pathname === '/add-user'} 
          onClick={isMobile ? onClose : undefined}
        >
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary={t('addUser')} />
        </ListItemButton>

        <ListItemButton 
          onClick={handleMilkMasterClick}
          selected={location.pathname.startsWith('/milkRate')}
        >
          <ListItemIcon>
            <LocalDrinkIcon />
          </ListItemIcon>
          <ListItemText primary={t('milkMaster')} />
          {!isCollapsed && (milkMasterOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        <Collapse in={milkMasterOpen && !isCollapsed} timeout="auto" unmountOnExit>
          <List 
            component="div" 
            disablePadding
            sx={{
              '& .MuiListItemButton-root': {
                pl: { xs: 3, sm: 4 },
                py: { xs: 0.5, sm: 1 },
                color: theme.palette.mode === 'dark' ? '#94a3b8' : '#334155',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.24)' : '#f8fafc',
                  color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#334155',
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(59,130,246,0.24)' : 'rgba(37,99,235,0.08)',
                  color: theme.palette.mode === 'dark' ? '#93c5fd' : '#2563eb',
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.mode === 'dark' ? '#93c5fd' : '#2563eb',
                  },
                },
              }
            }}
          >
            <ListItemButton 
              component={Link} 
              to="/milkRateSlabs" 
              selected={location.pathname === '/milkRateSlabs'} 
              onClick={isMobile ? onClose : undefined}
            >
              <ListItemIcon>
                <LocalDrinkIcon />
              </ListItemIcon>
              <ListItemText primary={t('milkRateSlabs')} />
            </ListItemButton>

            <ListItemButton 
              component={Link} 
              to="/generateMilkRates" 
              selected={location.pathname === '/generateMilkRates'} 
              onClick={isMobile ? onClose : undefined}
            >
              <ListItemIcon>
                <LocalDrinkIcon />
              </ListItemIcon>
              <ListItemText primary={t('generateMilkRates')} />
            </ListItemButton>

            <ListItemButton 
              component={Link} 
              to="/milkRateChart" 
              selected={location.pathname === '/milkRateChart'} 
              onClick={isMobile ? onClose : undefined}
            >
              <ListItemIcon>
                <LocalDrinkIcon />
              </ListItemIcon>
              <ListItemText primary={t('milkRateChart')} />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton 
          component={Link} 
          to="/reportGenerator" 
          selected={location.pathname === '/reportGenerator'} 
          onClick={isMobile ? onClose : undefined}
        >
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary={t('reportGenerator', 'Collection Reports')} />
        </ListItemButton>

        <ListItemButton 
          component={Link} 
          to="/reportSetting" 
          selected={location.pathname === '/reportSetting'} 
          onClick={isMobile ? onClose : undefined}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('reportSetting', 'Report Settings')} />
        </ListItemButton>

        <ListItemButton 
          component={Link} 
          to="/milkReportPage" 
          selected={location.pathname === '/milkReportPage'} 
          onClick={isMobile ? onClose : undefined}
        >
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary={t('milkReportPage', 'Milk Reports')} />
        </ListItemButton>

        <ListItemButton 
          component={Link} 
          to="/milkReportSettings" 
          selected={location.pathname === '/milkReportSettings'} 
          onClick={isMobile ? onClose : undefined}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('milkReportSettings', 'Milk Report Settings')} />
        </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
