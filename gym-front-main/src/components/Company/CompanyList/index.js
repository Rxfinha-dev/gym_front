import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMaskToPhone } from '../../../helpers/addPhoneMask';
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
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Pagination,
    useMediaQuery,
    useTheme,

} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SideMenu from '../../SideMenu';
import MuiAlert from '@mui/material/Alert';
import { useApi } from '../../../helpers/api';
import { addMaskToCNPJ } from '../../../helpers/addCnpjMask';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CompanyList = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const { apiGet, apiDelete, ApiPatch } = useApi();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();
    const companysPerPage = 10;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchCompanies = async () => {
        try {
            const response = await apiGet(`/company/all`);
            setTotalPages(response.totalCompanies);
            setCompanies(response);
            setLoading(false)
        } catch (error) {
            setError('Failed to fetch companies');
            setSnackbarMessage('Erro ao carregar as empresas');
            setSnackbarOpen(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    })

    const handleDeleteCompany = async () => {
        if (companyToDelete) {
            try {
                setLoading(true);
                await apiDelete(`/company?id=${companyToDelete}`);
                setError(null);
                setSnackbarMessage('Aluno deletado com sucesso')
                setSnackbarOpen(true);
                fetchCompanies();
            } catch (error) {
                setError(error.message);
                setSnackbarMessage('Erro ao deletar o aluno: ' + error.message);
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
                setDeleteModalOpen(false);
                setCompanyToDelete(null);
            }
        }
    };

    const openDeleteModal = (companyId) => {
        setCompanyToDelete(companyId);
        setDeleteModalOpen(true);
    }

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
        setCompanyToDelete(null);
    }


    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleAddCompany = () => {
        navigate('/company-form')
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
                marginTop: 5,
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, maxWidth: 1200, width: '90%', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <IconButton onClick={toggleMenu}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', textAlign: 'center', flexGrow: 1 }}>
                        📋 Lista de Empresas
                    </Typography>
                </Box>

                {isMobile ? (
                    <Grid container spacing={2}>
                        {companies.map((company) => (
                            <Grid item xs={12} key={company.id}>
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
                                            {company.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {addMaskToPhone(company.phone)}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {company.cnpj}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton sx={{ color: theme.palette.info.main }}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton sx={{ color: theme.palette.error.main }}>
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

                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>CNPJ</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {companies.map((company, index) => (
                                    <TableRow
                                        key={company.id}
                                        sx={{
                                            backgroundColor: index % 2 ? theme.palette.action.hover : 'inherit',
                                            transition: 'background-color 0.3s',
                                            '&:hover': {
                                                backgroundColor: theme.palette.action.selected,
                                            },
                                        }}
                                    >
                                        <TableCell align="center">{company.fantasyName}</TableCell>
                                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{addMaskToPhone(company.phone)}</TableCell>
                                        <TableCell align="center">{addMaskToCNPJ(company.cnpj)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton sx={{ color: '#00bbff' }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => openDeleteModal(company.id)} sx={{ color: theme.palette.error.main }}>
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
                        count={Math.ceil(totalPages / companysPerPage)}
                        page={page}
                        onChange={handlePageChange}
                        sx={{ marginRight: 2 }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddCompany}
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: '25px', padding: '10px 20px', backgroundColor: '#00bbff' }}
                    >
                        Adicionar Empresa
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
                    <Button onClick={handleDeleteCompany} sx={{ color: "red" }}>Deletar</Button>
                </DialogActions>

            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
        </Box>
    );
};

export default CompanyList;
