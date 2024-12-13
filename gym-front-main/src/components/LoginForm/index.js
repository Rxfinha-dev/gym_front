/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Paper, TextField, useTheme } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo-round-no-background.png';
import { useApi } from '../../helpers/api';
import LoadingSpinner from '../Loading/LoadingSpinner';

const Login = () => {
  const { apiPost, apiGet } = useApi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Verifica se há um token ao carregar a página
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setLoading(true);
          await apiGet(`/check-token?token=${token}`);
          navigate('/home'); 
        } catch (error) {
          localStorage.clear();
          navigate('/login');
        } finally {
          setLoading(false);
        }
      }
    };

    checkToken();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await apiPost('/login', { email, password });

      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('companyId', response.companyId);

      setErrors([]);
      navigate('/home');
    } catch (error) {
      console.log('Error catch? ', error);
      if (error?.length > 0 || error.message) {
        setErrors(error.message ? [{ msg: error.message }] : error);
      } else {
        setErrors([{ msg: 'Erro desconhecido. Tente novamente mais tarde.' }]);
      }
    } finally {
      setLoading(false);
    }
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
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, maxWidth: 400, width: '100%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{
            marginBottom: 2,
            [theme.breakpoints.down('sm')]: { marginTop: 2 },
          }}
        >
          <Grid item xs={12} textAlign="center">
            <Box sx={{ textAlign: 'center' }}>
              <img src={logo} alt="Gym-front Logo" style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
          </Grid>
        </Grid>
        {errors.length > 0 && (
          <Box sx={{ marginBottom: 2, backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: 4, padding: 2 }}>
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              {errors.map((error, index) => (
                <li key={index} style={{ margin: '5px 0' }}>{error.msg}</li>
              ))}
            </ul>
          </Box>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused': {
                  '& fieldset': {
                      borderColor: '#00bbff',
                  },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00bbff',
              },
          }}
          />
          <TextField
            label="Senha"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused': {
                  '& fieldset': {
                      borderColor: '#00bbff',
                  },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00bbff',
              },
          }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <Button style={{backgroundColor: '#00bbff'}} variant="contained" type="submit">
              Entrar
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
