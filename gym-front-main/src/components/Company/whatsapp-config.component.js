import React from 'react';
import { Box, Typography, Button, Avatar, CircularProgress } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const WhatsAppConnectionStatus = ({ qrCodeLoading, companyNumber, status, onWhatsClick }) => {
  // Define as cores com base no status da conexão
  const getStatusColor = () => {
    switch (status) {
      case 'CONNECTED':
        return 'green';
      case 'PROCESSING':
        return 'orange';
      case 'DISCONNECTED':
        return 'gray';
      default:
        return 'gray';
    }
  };

  // Define a animação com base no status
  const getStatusAnimation = () => {
    switch (status) {
      case 'CONNECTED':
        return 'blink 1.5s infinite';
      case 'PROCESSING':
        return 'pulse 2s infinite';
      default:
        return 'none';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 3,
        padding: 3,
        borderRadius: 3,
        backgroundColor: '#f5f5f5',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            backgroundColor: '#25D366', // Cor fixa para o ícone do WhatsApp
            marginRight: 2,
            width: 56,
            height: 56,
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 32, color: '#fff' }} />
        </Avatar>
        <Box>
          <Typography variant="h6" component="div">
            Status da Conexão do WhatsApp
          </Typography>
          <Typography variant="body2" color="textSecondary" >
            {companyNumber}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            marginRight: 1,
            animation: getStatusAnimation(),
          }}
        />
        <Typography variant="body1" sx={{ color: getStatusColor(), fontWeight: 'bold' }}>
          {status === 'CONNECTED' && 'Conectado'}
          {status === 'PROCESSING' && 'Verificando...'}
          {status === 'DISCONNECTED' && 'Não Conectado'}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {(status === 'CONNECTED' || status === 'DISCONNECTED') && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onWhatsClick}
            sx={{ borderRadius: '20px' }}
          >
            {status === 'CONNECTED' && 'Desconectar'}
            {status === 'DISCONNECTED' && 'Gerar QR Code'}
            {qrCodeLoading && <CircularProgress size={24} color="inherit" />}
          </Button>
        )}
      </Box>

      {/* Estilos para as animações */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
};

export default WhatsAppConnectionStatus;
