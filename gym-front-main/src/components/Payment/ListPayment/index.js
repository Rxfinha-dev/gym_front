import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  Snackbar,
  TableCell,
  Alert,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useApi } from '../../../helpers/api';
import { formatDate } from '../../../helpers/formatDate';
import { formatPhone } from '../../../helpers/formatPhone';
import { formatMonth } from '../../../helpers/formatMonth';
import LoadingSpinner from '../../Loading/LoadingSpinner';
import SideMenu from '../../SideMenu';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const { apiGet, apiPost } = useApi();
  const location = useLocation();
  const navigate = useNavigate(); // Hook to handle navigation
  const queryParams = new URLSearchParams(location.search);
  const initialPaidFilter = queryParams.get('paid') || '';
  const [menuOpen, setMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    clientName: queryParams.get('clientName') || '',
    dueDay: queryParams.get('dueDay') || '',
    month: queryParams.get('month') || (new Date().getMonth() + 1),
    year: queryParams.get('year') || new Date().getFullYear(),
    paid: initialPaidFilter,
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [confirmPayment, setConfirmPayment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const theme = useTheme();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Atualiza a URL
    const query = new URLSearchParams(newFilters).toString();
    navigate(`?${query}`, { replace: true });
  };

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const query = Object.keys(filters)
        .filter((key) => filters[key])
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
        .join('&');
      const response = await apiGet(`/client/payment?${query}`);
      let filteredPayments = response;
      if (filters.paid === 'true') {
        filteredPayments = response.map((payment) => ({ ...payment, paid: true }));
      } else if (filters.paid === 'false') {
        filteredPayments = response.map((payment) => ({ ...payment, paid: false }));
      }
      setPayments(filteredPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to fetch plans');
      setSnackbarMessage('Erro ao carregar pagamentos');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [filters, apiGet]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const handleSearchToggle = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setSearchVisible(!searchVisible);

    // Atualiza a URL
    const query = new URLSearchParams(newFilters).toString();
    navigate(`?${query}`, { replace: true });
  };

  const handleToggleChange = (payment) => {
    if (payment.paid) return;
    setConfirmPayment(payment);
    setSelectedDate(new Date());
  };

  const handleConfirm = async () => {
    if (confirmPayment) {
      setLoading(true);
      try {
        await apiPost('/payment', {
          clientId: confirmPayment.id,
          month: filters.month,
          year: filters.year,
          paymentDate: new Date(selectedDate),
        });
        setError(null);
        setSnackbarMessage('Pagamento confirmado com sucesso');
        setSnackbarOpen(true);
        fetchPayments();
      } catch (error) {
        console.error('Error confirming payment:', error);
        setError(error);
        setSnackbarMessage('Erro ao confirmar pagamento');
        setSnackbarOpen(true);
        setLoading(false);
      }
      setConfirmPayment(null);
    }
  };

  const handleCancel = () => {
    setConfirmPayment(null);
  };

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

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
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, maxWidth: 1200, width: '90%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Grid container alignItems="center" spacing={2} sx={{ marginBottom: 2 }}>
          <Grid item>
            <IconButton onClick={toggleMenu}>
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Pagamentos
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ marginBottom: 3 }}>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              label="Mês"
              select
              fullWidth
              value={filters.month}
              onChange={handleInputChange}
              name="month"
              variant="outlined"
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
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              label="Ano"
              select
              fullWidth
              value={filters.year}
              onChange={handleInputChange}
              name="year"
              variant="outlined"
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
            >
              {[...Array(10)].map((_, index) => (
                <MenuItem key={index} value={new Date().getFullYear() - index}>
                  {new Date().getFullYear() - index}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Dia de vencimento"
              select
              fullWidth
              value={filters.dueDay}
              onChange={handleInputChange}
              name="dueDay"
              variant="outlined"
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
            >
              <MenuItem value="">
                <em>Selecione</em>
              </MenuItem>
              {Array.from({ length: 31 }, (_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={10} sm={5} md={2}>
            <TextField
              label="Pagamento"
              select
              fullWidth
              value={filters.paid}
              onChange={handleInputChange}
              name="paid"
              variant="outlined"
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
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Pagos</MenuItem>
              <MenuItem value="false">Não Pagos</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Aluno"
              fullWidth
              value={filters.clientName}
              onChange={handleInputChange}
              name="clientName"
              variant="outlined"
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
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearchToggle}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Pago</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Aluno</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Dia de Vencimento</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Valor</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Data do Pagamento</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 ? theme.palette.action.hover : 'inherit',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                >   <TableCell align="center">
                    <Switch
                      checked={payment.paid}
                      onChange={() => handleToggleChange(payment)}
                      disabled={payment.paid}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#01bbff',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#00bbff',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">{payment.name}<br></br>{formatPhone(payment.phone)}</TableCell>
                  <TableCell align="center">{payment.dueDay}</TableCell>
                    <TableCell align="center">R$ {payment.payments.length > 0 ? payment.payments[0].value.toFixed(2).replace('.', ',') :  payment.plan.price}</TableCell>
                    <TableCell align="center">{payment.payments.length > 0 ? formatDate(payment.payments[0].paymentDate) : ' - '}</TableCell>
                    <TableCell align="center"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={Boolean(confirmPayment)} onClose={handleCancel} PaperProps={{
      style: {
        padding: '20px',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
        Confirmar Pagamento
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ textAlign: 'center', marginBottom: '20px', fontSize: '1rem' }}>
          Tem certeza que deseja confirmar o pagamento do cliente <strong>{confirmPayment?.name}</strong> referente ao mês <strong>{formatMonth(filters.month)}/{filters.year}</strong>?
        </DialogContentText>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <Typography variant="body1" sx={{ marginBottom: '10px', fontWeight: '500' }}>
            Data do Pagamento:
          </Typography>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom"
            showPopperArrow={false}
            portalId="root-portal"
            customInput={
              <TextField
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: {
                    textAlign: 'center',
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                    },
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                    
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00bbff'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00bbff'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00bbff',
                  },
                }}
              />
            }
            wrapperClassName="datepicker-input"
            popperClassName="datepicker-popper"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
        <Button
          onClick={handleCancel}
          sx={{
            color: theme.palette.common.white,
            fontWeight: 'bold',
            backgroundColor: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.dark,
            },
            borderRadius: '8px',
            padding: '8px 16px',
            textTransform: 'none',
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          sx={{
            color: theme.palette.common.white,
            fontWeight: 'bold',
            backgroundColor: '#00bbff',
            '&:hover': {
              backgroundColor: '#00bfff',
            },
            borderRadius: '8px',
            padding: '8px 16px',
            textTransform: 'none',
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
    </Box>
  );
};

export default Payment;
