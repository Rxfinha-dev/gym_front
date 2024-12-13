export const authHelper = {
    getToken: () => localStorage.getItem('token'),
    getRefreshToken: () => localStorage.getItem('refreshToken'),
    setToken: (token) => localStorage.setItem('token', token),
    setRefreshToken: (refreshToken) => localStorage.setItem('refreshToken', refreshToken),
    clearTokens: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId'); 
      localStorage.removeItem('companyId')
    }
  };
  