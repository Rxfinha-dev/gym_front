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
  Switch,
  MenuItem,
  FormControl,
  InputLabel,
  Select,

} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { useApi } from '../../../helpers/api';
import { addMaskToPhone } from '../../../helpers/addPhoneMask';
import SideMenu from '../../SideMenu';
import LoadingSpinner from '../../Loading/LoadingSpinner';
import MuiAlert from '@mui/material/Alert';
import useDebounce from '../../../helpers/useDebounce';  // Importe o hook de debounce

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StudentList = () => {
  const { apiGet, apiDelete, apiPatch } = useApi();
  const [menuOpen, setMenuOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameSearch, setNameSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [planIdFilter, setPlanIdFilter] = useState('');
  const [dueDayFilter, setDueDayFilter] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('true');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmActive, setConfirmActive] = useState(false);
  const navigate = useNavigate();
  const studentsPerPage = 10;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const debouncedNameSearch = useDebounce(nameSearch, 500);  // 500ms debounce
  const debouncedPhoneSearch = useDebounce(phoneSearch, 500);

  const fetchStudents = async () => {
    try {
      const isActiveQuery = isActiveFilter === '' ? '' : `&isActive=${isActiveFilter === 'true'}`;
      const response = await apiGet(`/client?page=${page}&limit=${studentsPerPage}${debouncedPhoneSearch ? `&phone=${debouncedPhoneSearch}` : ''}${debouncedNameSearch ? `&name=${debouncedNameSearch}` : ''}${planIdFilter ? `&planId=${planIdFilter}` : ''}${dueDayFilter ? `&dueDay=${dueDayFilter}` : ''}${isActiveQuery}`);
      setTotalPages(response.totalClients);
      setFilteredStudents(response.clients);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch students');
      setSnackbarMessage('Erro ao carregar os alunos');
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await apiGet('/plan');
      setPlans(response);
      setLoading(false);
    } catch (error) {
      setSnackbarMessage('Erro ao carregar os planos');
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchPlans();
  }, [debouncedNameSearch, debouncedPhoneSearch, planIdFilter, dueDayFilter, isActiveFilter, page]);

  const handleEditStudent = (studentId) => {
    navigate(`/user/edit/${studentId}`);
  };

  const handleDeleteStudent = async () => {
    if (studentToDelete) {
      try {
        setLoading(true);
        await apiDelete(`/client?id=${studentToDelete}`);
        setError(null);
        setSnackbarMessage('Aluno deletado com sucesso');
        setSnackbarOpen(true);
        fetchStudents();
      } catch (error) {
        setError(error.message);
        setSnackbarMessage('Erro ao deletar o aluno: ' + error.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
        setDeleteModalOpen(false);
        setStudentToDelete(null);
      }
    }
  };

  const openDeleteModal = (studentId) => {
    setStudentToDelete(studentId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  const handleAddStudent = () => {
    navigate('/user');
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

  const handleToggleChange = async (student) => {
    setConfirmActive(student);
  };

  const handleConfirm = async () => {
    if (confirmActive) {
      setLoading(true);
      try {
        await apiPatch(`/client/${confirmActive.id}`, { isActive: !confirmActive.isActive });
        setError(null);
        setSnackbarMessage(`Aluno ${confirmActive.isActive ? 'desativado' : 'ativado'} com sucesso`);
        setSnackbarOpen(true);
        fetchStudents();
      } catch (error) {
        console.error('Error confirming activation:', error);
        setError(error);
        setSnackbarMessage(`Erro ao ${confirmActive.isActive ? 'desativar' : 'ativar'} o aluno`);
        setSnackbarOpen(true);
        setLoading(false);
      } finally {
        setConfirmActive(null);
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setConfirmActive(null);
  };

  const handleNameFilter = (event) => {
    setNameSearch(event.target.value);
  };

  const handlePhoneFilter = (event) => {
    setPhoneSearch(event.target.value);
  };

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
            📋 Lista de Alunos
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            marginBottom: 3,
          }}
        >
          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              label="Nome"
              variant="outlined"
              value={nameSearch}
              onChange={handleNameFilter}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: { borderRadius: '25px' }
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused': {
                  '& fieldset': {
                    borderColor: '#00bbff',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00bbff',
                },
                flex: 1
              }}
            />
            <TextField
              label="Telefone"
              variant="outlined"
              value={phoneSearch}
              onChange={handlePhoneFilter}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                style: { borderRadius: '25px' }
              }}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused': {
                  '& fieldset': {
                    borderColor: '#00bbff',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00bbff',
                },
                flex: 1
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <TextField
              label="Ativo?"
              select
              fullWidth
              value={isActiveFilter}
              onChange={(e) => {
                console.log(e.target.value);
                setIsActiveFilter(e.target.value);
              }}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused': {
                  '& fieldset': {
                    borderColor: '#00bbff',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00bbff',
                },
                flex: 1
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="true">Ativos</MenuItem>
              <MenuItem value="false">Inativos</MenuItem>
            </TextField>
            <FormControl variant="outlined" fullWidth sx={{
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
              flex: 1
            }}>
              <InputLabel>Plano</InputLabel>
              <Select
                value={planIdFilter}
                onChange={(e) => setPlanIdFilter(e.target.value)}
                label="Plano"
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                {plans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name} - R$ {plan.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" fullWidth sx={{
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
              flex: 1
            }}>
              <InputLabel>Dia do vencimento</InputLabel>
              <Select
                value={dueDayFilter}
                onChange={(e) => setDueDayFilter(e.target.value)}
                label="Dia do vencimento"
              >
                <MenuItem value=""><em>Todos</em></MenuItem>
                {[...Array(31).keys()].map(day => (
                  <MenuItem key={day + 1} value={day + 1}>{day + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {isMobile ?
          (
            <Grid container spacing={2}>
              {filteredStudents.map((student) => (
                <Grid item xs={12} key={student.id}>
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
                        {student.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {addMaskToPhone(student.phone)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {student.plans.find(x => x.deletedAt === null)?.name || 'N/A'} - R$ {student.plans.find(x => x.deletedAt === null)?.price || '0.00'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Dia de Vencimento: {student.dueDay}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <Box>
                        <IconButton onClick={() => handleEditStudent(student.id)} sx={{ color: '#00bbff' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => openDeleteModal(student.id)} sx={{ color: theme.palette.error.main }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1, textAlign: 'center' }}>
                          Ativo?
                        </Typography>
                        <Switch
                          checked={student.isActive}
                          onChange={() => handleToggleChange(student)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#00bbff',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#00bbff',
                            },
                          }}
                        />
                      </Box>
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
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Ativo</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Plano</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Preço</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Dia de Vencimento</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow
                      key={student.id}
                      sx={{
                        backgroundColor: index % 2 ? theme.palette.action.hover : 'inherit',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          backgroundColor: theme.palette.action.selected,
                        },
                      }}
                    >
                      <TableCell align='center'>
                        <Switch
                          checked={student.isActive}
                          onChange={() => handleToggleChange(student)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#00bbff',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#00bbff',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell align='center'>{student.name}</TableCell>
                      <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{addMaskToPhone(student.phone)}</TableCell>
                      <TableCell align='center'>{student.plans.find(x => x.deletedAt === null)?.name || 'N/A'}</TableCell>
                      <TableCell align='center'>R$ {student.plans.find(x => x.deletedAt === null)?.price.toFixed(2).replace('.', ',') || '0.00'}</TableCell>
                      <TableCell align='center'>{student.dueDay}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleEditStudent(student.id)} sx={{ color: '#00bbff' }}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => openDeleteModal(student.id)} sx={{ color: theme.palette.error.main }}>
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
            count={Math.ceil(totalPages / studentsPerPage)}
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
            onClick={handleAddStudent}
            sx={{ borderRadius: '25px', padding: '10px 20px', backgroundColor: '#00bbff' }}
          >
            Adicionar Aluno
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
            Tem certeza de que deseja deletar este aluno?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteModal} sx={{ color: "#00bbff" }}>Cancelar</Button>
          <Button onClick={handleDeleteStudent} sx={{ color: "red" }}>Deletar</Button>
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
      <Dialog open={Boolean(confirmActive)} onClose={handleCancel} PaperProps={{
        style: {
          padding: '20px',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      }}>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
          Confirmar {confirmActive?.isActive ? 'desativação' : 'ativação'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', marginBottom: '20px', fontSize: '1rem' }}>
            Tem certeza que deseja confirmar a <strong>{confirmActive?.isActive ? 'desativação' : 'ativação'}</strong> do cliente <strong>{confirmActive?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button
            onClick={handleCancel}
            sx={{
              color: "red",
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
              color: "#00bbff",
              borderRadius: '8px',
              padding: '8px 16px',
              textTransform: 'none',
            }}
          >            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
    </Box>
  );
};

export default StudentList;
