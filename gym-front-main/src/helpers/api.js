import { authHelper } from './authHelper';
import { useAuth } from './AuthContext';

const BASE_URL = process.env.REACT_APP_API_URL;

export const useApi = () => {
  const { redirectToLogin } = useAuth();

  const getHeaders = () => {
    const token = authHelper.getToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  const handleRetryAndRefreshToken = async (response, retry, path, options = {}) => {
    if(response.status === 403 && retry) {
      await refreshToken();
      try {
        return fetch(`${BASE_URL}${path}`, { ...options, retry: false, headers: getHeaders() }); // Retry a requisição original
      } catch (error) {
        console.log('Error retrying request:', error);
        authHelper.clearTokens();
        redirectToLogin();
      }
    } else if (response.status === 403) {
      authHelper.clearTokens();
      redirectToLogin();
    }
  }

  const refreshToken = async () => {
    const refreshToken = authHelper.getRefreshToken();
    
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });
        
    if (!response.ok) {
      redirectToLogin();
    }
    
    const data = await response.json();
    authHelper.setToken(data.token);
    authHelper.setRefreshToken(data.refreshToken);
  };

  const apiPost = async (path, body, retry = true) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();

      const retryResponse = await handleRetryAndRefreshToken(response, retry, path, { method: 'POST', body: JSON.stringify(body) });

      if(retryResponse) {
        return retryResponse.json();
      }

      throw error.errors || error;
    }

    return response.json();
  };

  const apiGet = async (path, retry = true) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
       const error = await response.json();

       const retryResponse = await handleRetryAndRefreshToken(response, retry, path, { method: 'GET' });

       if(retryResponse) {
         return retryResponse.json();
       }

      throw error.errors || error;
    }

    return response.json();
  };

  const apiPut = async (path, body, retry = true) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();

      const retryResponse = await handleRetryAndRefreshToken(response, retry, path, { method: 'PUT', body: JSON.stringify(body) });

      if(retryResponse) {
        return retryResponse.json();
      }

      throw error.errors || error;
    }

    return response.json();
  };

  const apiPatch = async (path, body, retry = true) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();

      const retryResponse = await handleRetryAndRefreshToken(response, retry, path, { method: 'PATCH', body: JSON.stringify(body) });

      if(retryResponse) {
        return retryResponse.json();
      }

      throw error.errors || error;
    }

    // return response.json();
  };

  const apiDelete = async (path, retry = true) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();

      const retryResponse = await handleRetryAndRefreshToken(response, retry, path, { method: 'DELETE' });

      if(retryResponse) {
        return retryResponse.json();
      }

      throw error.errors || error;
    }

    // return response.json();
  };

  return { apiPost, apiGet, apiPut, apiPatch, apiDelete };
};
