import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authHelper } from '../../helpers/authHelper';

const SideMenu = ({ isOpen, toggleMenu }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    toggleMenu();
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={toggleMenu}>
      <Box
        sx={{
          width: 250,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <Box>
          <List>
            <ListItem button onClick={() => handleNavigation('/home')}>
              <HomeIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/company')}>
              <BusinessIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Dados da empresa" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/user-list')}>
              <PeopleIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Alunos" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/plan-list')}>
              <AssignmentIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Planos" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/payment')}>
              <PaymentIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Pagamentos" />
            </ListItem>
            
          </List>
          <Divider />
        </Box>
        <Box>
          <List>
            <ListItem
              button
              onClick={() => {
                authHelper.clearTokens();
                handleNavigation('/login');
              }}
            >
              <ExitToAppIcon sx={{ marginRight: 2 }} />
              <ListItemText primary="Sair" />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default SideMenu;
