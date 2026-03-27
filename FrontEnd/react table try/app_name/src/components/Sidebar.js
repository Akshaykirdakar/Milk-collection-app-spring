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

const drawerWidth = {
  xs: '100%',
  sm: '240px',
  md: '280px'
};

export default function Sidebar({ open, onClose, isMobile }) {
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const [milkMasterOpen, setMilkMasterOpen] = React.useState(true);

  const handleMilkMasterClick = () => {
    setMilkMasterOpen(!milkMasterOpen);
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={open}
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
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          overflowX: 'hidden',
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
          overflow: 'auto', 
          mt: { xs: 2, sm: 8 },
          px: { xs: 1, sm: 2 }
        }}
      >
        <List
          component="nav"
          sx={{
            '& .MuiListItemIcon-root': {
              color: theme.palette.primary.contrastText,
              minWidth: { xs: 40, sm: 45 },
            },
            '& .MuiListItemButton-root': {
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1, sm: 2 },
              borderRadius: 1,
              transition: theme.transitions.create(['background-color', 'border-left'], {
                duration: theme.transitions.duration.shorter,
              }),
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&.Mui-selected': {
                backgroundColor: `${theme.palette.primary.dark} !important`,
                borderLeft: `4px solid ${theme.palette.secondary.main}`,
              },
            },
            '& .MuiListItemText-primary': {
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 500,
            },
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
          {milkMasterOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={milkMasterOpen} timeout="auto" unmountOnExit>
          <List 
            component="div" 
            disablePadding
            sx={{
              '& .MuiListItemButton-root': {
                pl: { xs: 3, sm: 4 },
                py: { xs: 0.5, sm: 1 },
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
          <ListItemText primary={t('reportGenerator', 'Report Generator')} />
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
          <ListItemText primary={t('reportSetting', 'Report Setting')} />
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
          <ListItemText primary={t('milkReportPage', 'Milk Report Page')} />
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
