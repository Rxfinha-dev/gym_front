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
import { set } from 'date-fns';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ChangePassword = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { apiPatch } = useApi();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false); // Inicia como false para evitar bloqueio
  const navigate = useNavigate();
  const theme = useTheme();

  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    // Verificar se as senhas coincidem
    if (newPassword !== confirmPassword) {
      let error;
      setErrors([error]);
      setSnackbarMessage("As senhas não coincidem. Tente novamente.");
      setSnackbarOpen(true);
      return;
    }  
    try {
      setLoading(true);
      await apiPatch(`/user/change-password`, {currentPassword, newPassword});
      setErrors([]);
       navigate('/company');
    } catch (error) {
      console.log("Error catch? ", error);
      setErrors([error]);
      if (error?.length > 0 || error.message) {
        setSnackbarMessage(error[0]?.msg ? error[0]?.msg : error.message);
      } else {
        setSnackbarMessage("Erro desconhecido. Tente novamente mais tarde.");
      }
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
              Redefinir Senha
            </Typography>
          </Grid>
        </Grid>
        <form className="registration-form" id='emailForm' onSubmit={handleChangePassword}>
        <TextField
            label="Senha"
            variant="outlined"
            fullWidth
            margin="normal"
            type='password'
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
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
          <TextField
            label="Nova Senha"
            variant="outlined"
            fullWidth
            margin="normal"
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          <TextField
            label="Confirmar Senha"
            variant="outlined"
            fullWidth
            margin="normal"
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={5000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={errors.length ? 'error' : 'success'}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, backgroundColor: "#00bbff" }}>
            Cadastrar
          </Button>
        </form>
      </Paper>
      <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
    </Box>
  );
};

export default ChangePassword;
