// Utility functions for handling authentication tokens

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};