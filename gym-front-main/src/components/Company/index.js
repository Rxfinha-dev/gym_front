import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import { ENotificationType } from '../../enuns/ENotificationType.enum';
import { addMaskToCNPJ } from '../../helpers/addCnpjMask';
import { addMaskToPhone } from '../../helpers/addPhoneMask';
import { useApi } from '../../helpers/api';
import LoadingSpinner from '../Loading/LoadingSpinner';
import SideMenu from '../SideMenu';
import { useNavigate } from 'react-router-dom';
import WhatsAppConnectionStatus from './whatsapp-config.component';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NotificationSettings = () => {
  const { apiGet, apiPatch, apiPost } = useApi();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [companyData, setCompanyData] = useState({
    fantasyName: '',
    cnpj: '',
    phone: '',
  });
  const [whatsappStatus, setWhatsappStatus] = useState('PROCESSING');

  const [showNotificationOverdueClients, setShowNotificationOverdueClients] = useState(false);
  const [showNotificationToClientOverdueClients, setShowNotificationToClientOverdueClients] = useState(false);
  const [showNotificationUnpaidClients, setShowNotificationUnpaidClients] = useState(false);

  const [notificationOverdueClients, setNotificationOverdueClients] = useState({
    enabled: true,
    frequency: 'daily',
  });
  const [notificationToClientOverdueClients, setNotificationToClientOverdueClients] = useState({
    enabled: true,
    frequency: 'daily',
  });
  const [notificationUnpaidClients, setNotificationUnpaidClients] = useState({
    enabled: true,
    frequency: 'first-day',
  });

  const [qrCode, setQrCode] = useState('');
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);

  // Fetch company data on component mount
  useEffect(() => {
    fetchCompanyData();
    // getWhatsAppStatus();
  }, []);

  const getWhatsAppStatus = async () => {
    try {
      const response = await apiGet('/whatsapp/status');
      setWhatsappStatus(response.connectionStatus);
    } catch (error) {
      setSnackbarMessage('Erro ao checar whatsapp: ' + error.message);
      setSnackbarOpen(true);
      setError(error.message);

    }
  };

  const fetchCompanyData = async () => {
    try {
      const response = await apiGet('/company');
      setCompanyData(response);

      setShowNotificationOverdueClients(response.companySetting.sendOverdueNotificationToCompany);
      setShowNotificationToClientOverdueClients(response.companySetting.sendOverdueNotificationToClients);
      setShowNotificationUnpaidClients(response.companySetting.sendOverdueForLastMonthToCompany);

      const notificationOverdueClientsResponse = response.notifications.find(notification => notification.type === ENotificationType.OVERDUE_NOTIFICATION_TO_COMPANY);
      setNotificationOverdueClients({
        frequency: notificationOverdueClientsResponse?.frequency || '',
        enabled: notificationOverdueClientsResponse?.enabled || false
      });

      const notificationToClientOverdueClientsResponse = response.notifications.find(notification => notification.type === ENotificationType.OVERDUE_NOTIFICATION_TO_CLIENTS);
      setNotificationToClientOverdueClients({
        frequency: notificationToClientOverdueClientsResponse?.frequency || '',
        enabled: notificationToClientOverdueClientsResponse?.enabled || false
      });

      const notificationUnpaidClientsResponse = response.notifications.find(notification => notification.type === ENotificationType.OVERDUE_FOR_LAST_MONTH_TO_COMPANY);
      setNotificationUnpaidClients({
        frequency: notificationUnpaidClientsResponse?.frequency || '',
        enabled: notificationUnpaidClientsResponse?.enabled || false
      });

      setLoading(false);
    } catch (error) {
      setError('Failed to fetch company data');
      setSnackbarMessage('Erro ao buscar dados da empresa ');
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      await apiPatch('/notification', {
        overdueForLastMonthToCompany: notificationUnpaidClients.enabled,
        overdueForLastMonthFrequency: notificationUnpaidClients.frequency,
        overdueNotificationToCompany: notificationOverdueClients.enabled,
        overdueNotificationFrequency: notificationOverdueClients.frequency

      });
      setSnackbarMessage('Configurações salvas com sucesso');
      setSnackbarOpen(true);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setSnackbarMessage('Erro ao salvar configurações: ' + error.message);
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const generateQrCode = async () => {
    setQrCodeLoading(true);
    try {
      const response = await apiGet(`/whatsapp/qrcode`);
      setQrCode(response.qrCodeImage); // Assume the API returns a base64 QR code
      setQrCodeDialogOpen(true);
    } catch (error) {
      setSnackbarMessage('Erro ao gerar QR Code');
      setSnackbarOpen(true);
      setError('Failed to generate QR code');
    } finally {
      setQrCodeLoading(false);
    }
  };

  const disconnectWhatsapp = async () => {
    setQrCodeLoading(true);
    try {
      const response = await apiPost('/whatsapp/disconnect');
      setWhatsappStatus(response.connectionStatus);
    } catch (error) {
      setSnackbarMessage('Erro ao desconectar whatsapp');
      setSnackbarOpen(true);
      setError(error.message);
    } finally {
      setQrCodeLoading(false);
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseQrCodeDialog = () => {
    setQrCodeDialogOpen(false);
  };

  const navigate = useNavigate();

  const handleEditPasswordScreen = () => {
    navigate('/change-password');
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
        marginTop: 5,  // Valor fixo para a margem superior
      }}
    >
      {loading && (
        <div className="loading-overlay">
          <LoadingSpinner />
        </div>
      )}
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 3,
          maxWidth: 800,
          width: '100%',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#ffffff',
        }}
      >
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
            Configurações
          </Typography>
        </Box>
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Dados da Empresa
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nome"
              variant="outlined"
              value={companyData.fantasyName}
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
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="CNPJ"
              variant="outlined"
              value={addMaskToCNPJ(companyData.cnpj)}
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
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Telefone"
              variant="outlined"
              value={addMaskToPhone(companyData.phone)}
              onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
              fullWidth
              inputProps={{ maxLength: 15 }}  // Define o limite de caracteres para o telefone
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

          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {(showNotificationOverdueClients || showNotificationToClientOverdueClients || showNotificationUnpaidClients) && 'Configurações de Notificação'}
            </Typography>
          </Grid>
          {showNotificationToClientOverdueClients && <><Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography>Notificação ao Cliente de Atraso no Pagamento</Typography>
              <Switch
                checked={notificationToClientOverdueClients.enabled}
                onChange={(e) => setNotificationToClientOverdueClients({
                  ...notificationToClientOverdueClients,
                  enabled: e.target.checked,
                })}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#01bbff',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#00bbff',
                  },
                }} />
            </Box>
          </Grid><Grid item xs={12} md={6}>
              <FormControl fullWidth
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
                <InputLabel>Frequência</InputLabel>
                <Select
                  disabled={!notificationToClientOverdueClients.enabled}
                  value={notificationToClientOverdueClients.frequency}
                  onChange={(e) => setNotificationToClientOverdueClients({
                    ...notificationToClientOverdueClients,
                    frequency: e.target.value,
                  })}
                  label="Frequência"
                >
                  <MenuItem value="daily">Diária</MenuItem>
                  <MenuItem value="fifth-day">Todo dia 5</MenuItem>
                  <MenuItem value="tenth-day">Todo dia 10</MenuItem>
                  <MenuItem value="fifteenth-day">Todo dia 15</MenuItem>
                  <MenuItem value="twentieth-day">Todo dia 20</MenuItem>
                  <MenuItem value="every-monday">Toda segunda-feira</MenuItem>
                  <MenuItem value="every-thursday">Toda quarta-feira</MenuItem>
                  <MenuItem value="every-friday">Toda sexta-feira</MenuItem>
                </Select>
              </FormControl>
            </Grid></>}

          {
            showNotificationOverdueClients && <><Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Notificação Interna de Cliente Atrasado</Typography>
                <Switch
                  checked={notificationOverdueClients.enabled}
                  onChange={(e) => setNotificationOverdueClients({
                    ...notificationOverdueClients,
                    enabled: e.target.checked,
                  })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#01bbff',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00bbff',
                    },
                  }} />
              </Box>
            </Grid><Grid item xs={12} md={6}>
                <FormControl fullWidth
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
                  <InputLabel>Frequência</InputLabel>
                  <Select
                    disabled={!notificationOverdueClients.enabled}
                    value={notificationOverdueClients.frequency}
                    onChange={(e) => setNotificationOverdueClients({
                      ...notificationOverdueClients,
                      frequency: e.target.value,
                    })}
                    label="Frequência"
                  >
                    <MenuItem value="daily">Diária</MenuItem>
                    <MenuItem value="fifth-day">Todo dia 5</MenuItem>
                    <MenuItem value="tenth-day">Todo dia 10</MenuItem>
                    <MenuItem value="fifteenth-day">Todo dia 15</MenuItem>
                    <MenuItem value="twentieth-day">Todo dia 20</MenuItem>
                    <MenuItem value="every-monday">Toda segunda-feira</MenuItem>
                    <MenuItem value="every-thursday">Toda quarta-feira</MenuItem>
                    <MenuItem value="every-friday">Toda sexta-feira</MenuItem>
                  </Select>
                </FormControl>
              </Grid></>
          }
          {
            showNotificationUnpaidClients && <><Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography>Notificar clientes sem pagamento no mês passado</Typography>
                <Switch
                  checked={notificationUnpaidClients.enabled}
                  onChange={(e) => setNotificationUnpaidClients({
                    ...notificationUnpaidClients,
                    enabled: e.target.checked,
                  })}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#01bbff',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00bbff',
                    },
                  }} />
              </Box>
            </Grid><Grid item xs={12} md={6}>
                <FormControl fullWidth
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
                  <InputLabel>Frequência</InputLabel>
                  <Select
                    disabled={!notificationUnpaidClients.enabled}
                    value={notificationUnpaidClients.frequency}
                    onChange={(e) => setNotificationUnpaidClients({
                      ...notificationUnpaidClients,
                      frequency: e.target.value,
                    })}
                    label="Frequência"
                  >
                    <MenuItem value="first-day">Todo dia 1</MenuItem>
                    <MenuItem value="fifth-day">Todo dia 5</MenuItem>
                    <MenuItem value="tenth-day">Todo dia 10</MenuItem>
                    <MenuItem value="fifteenth-day">Todo dia 15</MenuItem>
                    <MenuItem value="twentieth-day">Todo dia 20</MenuItem>
                  </Select>
                </FormControl>
              </Grid></>
          }
        </Grid>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 3,
          }}
        >
          {/* Botão Redefinir Senha à esquerda */}
          <Button
            style={{ backgroundColor: '#01bbff' }}
            variant="contained"
            onClick={handleEditPasswordScreen}
            sx={{ borderRadius: '25px', padding: '10px 20px' }}
          >
            Redefinir Senha
          </Button>

          {/* Botão Salvar à direita */}
          <Button
            style={{ backgroundColor: '#01bbff' }}
            variant="contained"
            type="submit"
            onClick={handleSaveSettings}
            sx={{ borderRadius: '25px', padding: '10px 20px' }}
          >
            Salvar
          </Button>
        </Box>
        {/* 
<WhatsAppConnectionStatus
  qrCodeLoading={qrCodeLoading}
  companyNumber={addMaskToPhone(companyData.phone)}
  status={whatsappStatus} 
  onWhatsClick={() => {
    console.log('status?: ', whatsappStatus)
    if (whatsappStatus === 'DISCONNECTED') {
      generateQrCode();
      console.log('Gerar QR Code');
    } else if (whatsappStatus === 'CONNECTED') {
      disconnectWhatsapp();
      console.log('Desconectar');
    }
  }}
/>
*/}

      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={qrCodeDialogOpen} onClose={handleCloseQrCodeDialog}>
        <DialogTitle>QR Code para Conectar WhatsApp</DialogTitle>
        <DialogContent>
          {qrCode ? (
            <img src={qrCode} alt="QR Code" style={{ width: '100%' }} />
          ) : (
            <Typography>QR Code não disponível</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQrCodeDialog} style={{ backgroundColor: '#01bbff' }} variant="contained">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <SideMenu isOpen={menuOpen} toggleMenu={toggleMenu} />
    </Box>
  );
};

export default NotificationSettings;
