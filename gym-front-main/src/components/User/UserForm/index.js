import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../../helpers/api';
import LoadingSpinner from '../../Loading/LoadingSpinner';
import SideMenu from '../../SideMenu';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const User = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { apiGet, apiPost } = useApi();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState([]);
  const [dueDay, setDueDay] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiGet('/plan');
        setPlans(response);
        setLoading(false);
      } catch (error) {
        setErrors([{ msg: 'Failed to fetch plans' }]);
        setSnackbarMessage('Erro ao carregar os planos');
        setSnackbarOpen(true);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleUserRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      var companyId = localStorage.getItem('companyId');
      await apiPost('/client', { name, phone, dueDay, planId: selectedPlan, companyId });
      setErrors([]);
      navigate('/user-list');
    } catch (error) {
      console.log('Error catch? ', error);
      setErrors([error])
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
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
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
              Cadastro de Aluno
            </Typography>
          </Grid>
        </Grid>
        <form className="registration-form" onSubmit={handleUserRegister}>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            margin="normal"
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
          <InputMask
            mask="(99) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          >
            {() => (
              <TextField
                label="Telefone"
                variant="outlined"
                fullWidth
                margin="normal"
                type="tel"
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
            )}
          </InputMask>
          <FormControl
            variant="outlined"
            fullWidth
            margin="normal"
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
              '& .MuiSelect-root.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00bbff',
                },
              },
            }}>
            <InputLabel>Dia do vencimento</InputLabel>
            <Select
              value={dueDay}
              onChange={(e) => setDueDay(e.target.value)}
              label="Dia do vencimento"
            >
              <MenuItem value=""><em>Selecione o dia</em></MenuItem>
              {[...Array(31).keys()].map(day => (
                <MenuItem key={day + 1} value={day + 1}>{day + 1}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            fullWidth
            margin="normal"
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
              '& .MuiSelect-root.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00bbff',
                },
              },
            }}>
            <InputLabel>Plano</InputLabel>
            <Select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              label="Plano"
            >
              <MenuItem value=""><em>Selecione o plano</em></MenuItem>
              {plans.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.name} - R$ {plan.price.toFixed(2).replace('.', ',')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={errors.length ? 'error' : 'success'}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Button type="submit" variant="contained"  fullWidth sx={{ mt: 2, backgroundColor: "#00bbff" }}>
            Cadastrar
          </Button>
        </form>
      </Paper>
      <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
    </Box>
  );
};

export default User;
