import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
  Snackbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LoadingSpinner from '../../Loading/LoadingSpinner';
import SideMenu from '../../SideMenu';
import { useApi } from '../../../helpers/api';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PlanEdit = () => {
  const { apiGet, apiPatch } = useApi();
  const { planId } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  const handlePriceChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    // Adiciona zeros à esquerda para garantir pelo menos 3 caracteres
    value = value.padStart(3, '0');

    const intPart = value.slice(0, -2).replace(/^0+/, '') || '0'; // Parte inteira sem zeros à esquerda
    const decPart = value.slice(-2); // Parte decimal

    // Formata com separadores de milhar e decimal
    const formattedValue = `R$ ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decPart}`;

    setPrice(formattedValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/plan/${planId}`);
        setErrors([]);
        setName(response.name);
        setPrice(response.price);
      } catch (error) {
        console.error('Failed to fetch plan:', error);
        setSnackbarMessage('Erro ao carregar o plano.');
        setErrors([{ msg: 'Failed to fetch plan data' }]);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId]);

  const handlePlanEdit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const numericPrice = parseFloat(price.replace(/[R$\s.]/g, '').replace(',', '.'));

      await apiPatch(`/plan?planId=${planId}`, { name, price: numericPrice });
      setErrors([]);

      navigate('/plan-list');
    } catch (error) {
      console.log('Error catch? ', error);
      setErrors([error]);
      if (error?.length > 0 || error.message) {
        setSnackbarMessage(error[0].msg ? error[0].msg : error.message);
      } else {
        setSnackbarMessage('Erro desconhecido. Tente novamente mais tarde.');
      }
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, maxWidth: 800, width: '100%' }}>
        <Grid
          container
          alignItems="center"
          spacing={2}
          sx={{
            marginBottom: 2,
            [theme.breakpoints.down('sm')]: { marginTop: 2 }
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
              Atualização de Plano
            </Typography>
          </Grid>
        </Grid>
        <form onSubmit={handlePlanEdit}>
          <Grid container spacing={2} sx={{ marginBottom: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    '& fieldset': {
                      borderColor: '#00bbff',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#00bbff',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Valor"
                variant="outlined"
                fullWidth
                value={price}
                onChange={handlePriceChange}
                placeholder="Ex.: R$ 0,00"
                required
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused': {
                    '& fieldset': {
                      borderColor: '#00bbff',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#00bbff',
                  }
                }}
                inputProps={{ inputMode: 'numeric' }} // Ensures proper input mode on mobile devices
              />
            </Grid>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={errors.length ? 'error' : 'success'}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2, backgroundColor: '#00bbff' }}>
              Atualizar
            </Button>
          </Box>
        </form>
      </Paper>

      <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
    </Box>
  );
};

export default PlanEdit;
