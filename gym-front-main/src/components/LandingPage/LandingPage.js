import React from 'react';
import { Box, Typography, Button, Grid, Paper, Container, Link, Stack } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import logo from '../../assets/images/logo-round-no-background.png';

const LandingPage = () => {
  return (
    <Box sx={{ backgroundColor: '#f4f4f9', minHeight: '100vh', paddingBottom: '2rem' }}>
      {/* Minimalist Header Section */}
      <Container sx={{ paddingY: '2rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <img src={logo} alt="Ultimanager Logo" style={{ maxWidth: '120px', height: 'auto' }} />
        </Box>

        {/* Title and Subtitle */}
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '0.5rem' }}>ULTIMANAGER</Typography>
        <Typography variant="h6" sx={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          Transforme a gestão da sua academia com eficiência e praticidade. Potencialize seu crescimento e ofereça a melhor experiência para seus alunos.
        </Typography>

        {/* Login Button positioned to the right */}
        <Button
          variant="outlined"
          href="/login"
          sx={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: '#1976d2',
            borderColor: '#1976d2',
            fontWeight: 'bold',
            borderRadius: '20px',
            padding: '0.5rem 1.5rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#e3f2fd',
            },
          }}
        >
          Login
        </Button>
      </Container>

      {/* Benefits Section */}
      <Container sx={{ marginTop: '3rem' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '2rem' }}>
          Por Que Escolher o Ultimanager?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: '2rem', textAlign: 'center', borderRadius: '15px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <PeopleIcon sx={{ fontSize: 50, color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>Gerenciamento de Alunos</Typography>
              <Typography variant="body2" sx={{ color: 'gray', marginTop: '0.5rem', textAlign: 'center' }}>
                Controle completo dos alunos da academia com cadastro, edição e gerenciamento.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: '2rem', textAlign: 'center', borderRadius: '15px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <FitnessCenterIcon sx={{ fontSize: 50, color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>Planos Personalizados</Typography>
              <Typography variant="body2" sx={{ color: 'gray', marginTop: '0.5rem', textAlign: 'center' }}>
                Crie e gerencie diferentes planos com opções flexíveis para seus clientes.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: '2rem', textAlign: 'center', borderRadius: '15px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <PaymentIcon sx={{ fontSize: 50, color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>Gestão de Pagamentos</Typography>
              <Typography variant="body2" sx={{ color: 'gray', marginTop: '0.5rem', textAlign: 'center' }}>
                Monitore e organize os pagamentos dos alunos de maneira eficaz.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: '2rem', textAlign: 'center', borderRadius: '15px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUpIcon sx={{ fontSize: 50, color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>Estatísticas e Crescimento</Typography>
              <Typography variant="body2" sx={{ color: 'gray', marginTop: '0.5rem', textAlign: 'center' }}>
                Acompanhe o crescimento da academia com dados e insights valiosos.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: '2rem', textAlign: 'center', borderRadius: '15px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <NotificationsActiveIcon sx={{ fontSize: 50, color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>Notificações de Atraso</Typography>
              <Typography variant="body2" sx={{ color: 'gray', marginTop: '0.5rem', textAlign: 'center' }}>
                Receba alertas pelo WhatsApp quando algum aluno estiver com pagamento atrasado, facilitando o acompanhamento.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Upcoming Feature Section */}
      <Container sx={{ marginTop: '4rem' }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '2rem' }}>
          Em Breve
        </Typography>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper sx={{ padding: '2rem', textAlign: 'center', backgroundColor: '#e3f2fd', borderRadius: '15px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Gestão de Treinos
              </Typography>
              <Typography variant="body1" sx={{ color: 'gray', marginTop: '0.5rem' }}>
                Em breve, será possível cadastrar treinos personalizados, e os alunos poderão consultar e acompanhar seus treinos de maneira fácil e rápida.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>


      {/* Call to Action */}
      <Box sx={{ textAlign: 'center', marginTop: '4rem' }}>
        <Typography variant="h6" sx={{ marginBottom: '1rem', color: 'gray' }}>
          Pronto para transformar sua academia com o Ultimanager?
        </Typography>
        <Button
          variant="contained"
          href="/login"
          sx={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            borderRadius: '25px',
            backgroundColor: '#1e88e5',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Faça Login e Comece Agora
        </Button>
      </Box>

      {/* Contact Section */}
      <Box sx={{ backgroundColor: '#f4f4f9', paddingY: '2rem', textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', marginBottom: '1rem' }}>
            Entre em Contato
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ flexWrap: 'wrap', paddingX: { xs: 2, sm: 0 } }}
          >
            <Link href="mailto:ultimanagersystem@gmail.com" target="_blank" sx={{ display: 'flex', alignItems: 'center', color: '#1976d2', textDecoration: 'none', marginBottom: { xs: '0.5rem', sm: 0 } }}>
              <EmailIcon sx={{ fontSize: 30, marginRight: '0.5rem' }} />
              <Typography variant="body1">ultimanagersystem@gmail.com</Typography>
            </Link>
            <Link href="https://instagram.com/ultimanagersystem" target="_blank" sx={{ display: 'flex', alignItems: 'center', color: '#1976d2', textDecoration: 'none', marginBottom: { xs: '0.5rem', sm: 0 } }}>
              <InstagramIcon sx={{ fontSize: 30, marginRight: '0.5rem' }} />
              <Typography variant="body1">@ultimanagersystem</Typography>
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box >
  );
};

export default LandingPage;
