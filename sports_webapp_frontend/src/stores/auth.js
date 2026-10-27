import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('admin_user') || 'null'),
    csrfToken: localStorage.getItem('csrf_token') || null,
    apiKey: localStorage.getItem('api_key') || 'esports_api_key_secret_123',
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    async login(email, apiKeyInput) {
      this.loading = true;
      this.error = null;
      try {
        if (apiKeyInput) {
          this.apiKey = apiKeyInput;
          localStorage.setItem('api_key', apiKeyInput);
        }

        const res = await api.post('/auth/login', { email: email.trim() });
        this.user = res.data.usuario;
        this.csrfToken = res.data.csrfToken;

        localStorage.setItem('admin_user', JSON.stringify(this.user));
        localStorage.setItem('csrf_token', this.csrfToken);

        return true;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al iniciar sesión';
        throw this.error;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      try {
        const res = await api.get('/auth/verify');
        this.user = res.data.usuario;
        localStorage.setItem('admin_user', JSON.stringify(this.user));
        return true;
      } catch (err) {
        this.logoutLocal();
        return false;
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } catch (err) {
        console.error('Logout falló en servidor:', err);
      } finally {
        this.logoutLocal();
      }
    },

    logoutLocal() {
      this.user = null;
      this.csrfToken = null;
      localStorage.removeItem('admin_user');
      localStorage.removeItem('csrf_token');
    }
  }
});