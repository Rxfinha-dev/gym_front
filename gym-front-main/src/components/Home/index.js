import 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import LoadingSpinner from '../Loading/LoadingSpinner';
import SideMenu from '../SideMenu';
import { useApi } from '../../helpers/api';

const Home = () => {
  const { apiGet } = useApi();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    latePayments: 0,
    monthPayments: 0,
  });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await apiGet('/dashboard');
        setDashboardData(data);
      } catch (error) {
        console.error('Erro ao buscar os dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (route) => {
    navigate(route);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
      }}
    >
      {loading && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}
      <Paper elevation={3} sx={{ padding: 4, borderRadius: 3, maxWidth: 800, width: '100%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{
            marginBottom: 3,
            [theme.breakpoints.down('sm')]: { marginTop: 2 },
          }}
        >
          <Grid item>
            <IconButton onClick={toggleMenu}>
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: 'bold', textAlign: 'center' }}
            >
              Menu Principal
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
              }}
            >
              <CardActionArea onClick={() => navigateTo('/user-list')}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: "#00bbff"
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 50,  color: "#00bbff" }} />
                  <Typography variant="h6" sx={{ marginTop: 1, color: "#00bbff"}}>Alunos Ativos</Typography>
                  <Typography variant="h4" sx={{ marginTop: 1, color: "#00bbff"}}>
                    {dashboardData.totalClients}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
              }}
            >
              <CardActionArea onClick={() => navigateTo('/payment?paid=false')}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: "#00bbff"
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 50, color:"#00bbff" }} />
                  <Typography variant="h6" sx={{ marginTop: 1,  }}>Atrasos</Typography>
                  <Typography variant="h4" sx={{ marginTop: 1, color: "#00bbff"}}>
                    {dashboardData.clientsNotPaidThisMonth}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
              }}
            >
              <CardActionArea onClick={() => navigateTo('/payment?paid=true')}>
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: "#00bbff"
                  }}
                >
                  <PaymentIcon sx={{ fontSize: 50, color: "#00bbff" }} />
                  <Typography variant="h6" sx={{ marginTop: 1 }}>Pagamentos</Typography>
                  <Typography variant="h4" sx={{ marginTop: 1, color: "#00bbff"}}>
                    {dashboardData.clientsPaidThisMonth}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
    </Box>
  );
};

export default Home;
