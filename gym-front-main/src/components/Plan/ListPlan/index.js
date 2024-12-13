import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useApi } from '../../../helpers/api';
import SideMenu from '../../SideMenu';
import LoadingSpinner from '../../Loading/LoadingSpinner';
import MuiAlert from '@mui/material/Alert';
import useDebounce from '../../../helpers/useDebounce';  // Importe o hook de debounce

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PlanList = () => {
  const { apiGet, apiDelete } = useApi();
  const [menuOpen, setMenuOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();
  const plansPerPage = 10;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const debouncedSearch = useDebounce(search, 500);  // 500ms debounce

  const fetchPlans = async () => {
    try {
      const response = await apiGet(`/plan?page=${page}&limit=${plansPerPage}${debouncedSearch ? `&name=${debouncedSearch}` : ''}`);
      setPlans(response);
      setFilteredPlans(response);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch plans');
      setSnackbarMessage('Erro ao carregar planos');
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [debouncedSearch]);

  const handleFilter = (event) => {
    setSearch(event.target.value);
  };

  const handleEditPlan = (planId) => {
    navigate(`/plan/edit/${planId}`);
  };

  const handleDeletePlan = async () => {
    if (planToDelete) {
      try {
        setLoading(true);
        await apiDelete(`/plan?id=${planToDelete}`);
        setError(null);
        setSnackbarMessage('Plano deletado com sucesso');
        setSnackbarOpen(true);
        fetchPlans();  // Recarrega a lista de planos após a deleção bem-sucedida
      } catch (error) {
        console.error('Failed to delete plan:', error);
        setError(error.message);
        setSnackbarMessage('Erro ao deletar o plano: ' + error.message);
        setSnackbarOpen(true);
      } finally {
        setDeleteModalOpen(false);
        setPlanToDelete(null);
        setLoading(false);
      }
    }
  };

  const openDeleteModal = (planId) => {
    setPlanToDelete(planId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleAddPlan = () => {
    navigate('/plan');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const displayedPlans = filteredPlans.slice(
    (page - 1) * plansPerPage,
    page * plansPerPage
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        marginTop: 5,  // Valor fixo para a margem superior
      }}
    >
      {loading && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, maxWidth: 1200, width: '90%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Box
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: 3,
          }}
        >
          <IconButton onClick={toggleMenu}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 'bold', textAlign: 'center', flexGrow: 1 }}
          >
            📋 Lista de Planos
          </Typography>
        </Box>
        <TextField
          label="Buscar por Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={handleFilter}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            style: { borderRadius: '25px' }
          }}
          sx={{ marginBottom: 3,
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
        {isMobile ? (
          <Grid container spacing={2}>
            {displayedPlans.map((plan) => (
              <Grid item xs={12} key={plan.id}>
                <Card
                  sx={{
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      R$ {plan.price.toFixed(2).replace('.', ',')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleEditPlan(plan.id)} sx={{ color: '#00bbff'}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => openDeleteModal(plan.id)} sx={{ color: theme.palette.error.main }}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='center' sx={{ fontWeight: 'bold' }}>Nome do Plano</TableCell>
                  <TableCell align='center' sx={{ fontWeight: 'bold' }}>Preço</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedPlans.map((plan, index) => (
                  <TableRow 
                    key={plan.id} 
                    sx={{ 
                      backgroundColor: index % 2 ? theme.palette.action.hover : 'inherit',
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                      },
                    }}
                  >
                    <TableCell align='center'>{plan.name}</TableCell>
                    <TableCell align='center'>R$ {plan.price.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleEditPlan(plan.id)} sx={{color: '#00bbff'}}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => openDeleteModal(plan.id)} sx={{ color: theme.palette.error.main }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 3 }}>
          <Pagination
            count={Math.ceil(filteredPlans.length / plansPerPage)}
            page={page}
            onChange={handlePageChange}
            sx={{ marginRight: 2 }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 3 }}>
        <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddPlan}
            sx={{ borderRadius: '25px', padding: '10px 20px', backgroundColor: '#00bbff' }}
          >
            Adicionar Plano
          </Button>
        </Box>
      </Paper>
      <Dialog
        open={deleteModalOpen}
        onClose={closeDeleteModal}
      >
        <DialogTitle>Confirmar Deleção</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja deletar este plano?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} sx={{color: "#00bbff"}}>Cancelar</Button>
          <Button onClick={handleDeletePlan} sx={{color: "red"}}>Deletar</Button>
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

export default PlanList;
