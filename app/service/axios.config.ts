import axios from 'axios';
import { signOut } from 'next-auth/react';

const axiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
});

// since jwt token.exp can be incorrect, we should handle 401 error
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      signOut({ callbackUrl: '/signin?errorcode=401' }); 
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
