import { defineStore } from 'pinia';
import api from '@/services/api';

export const useJugadoresStore = defineStore('jugadores', {
  state: () => ({
    jugadores: [],
    roles: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'],
    estados: ['Activo', 'Inactivo'],
    loading: false,
    error: null
  }),
  actions: {
    async fetchAuxiliares() {
      try {
        const [rolesRes, estadosRes] = await Promise.all([
          api.get('/roles'),
          api.get('/estados')
        ]);
        this.roles = rolesRes.data;
        this.estados = estadosRes.data;
      } catch (err) {
        console.error('Error cargando listas auxiliares:', err);
      }
    },

    async fetchJugadores(filters = {}) {
      this.loading = true;
      try {
        const params = new URLSearchParams();
        if (filters.rol) params.append('rol', filters.rol);
        if (filters.estado) params.append('estado', filters.estado);
        if (filters.search) params.append('search', filters.search);

        const res = await api.get(`/jugadores?${params.toString()}`);
        this.jugadores = res.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al obtener jugadores';
      } finally {
        this.loading = false;
      }
    },

    async crearJugador(data) {
      try {
        const res = await api.post('/jugadores', data);
        await this.fetchJugadores();
        return res.data;
      } catch (err) {
        throw err.response?.data?.error || 'Error al crear jugador';
      }
    },

    async actualizarJugador(id, data) {
      try {
        const res = await api.put(`/jugadores/${id}`, data);
        await this.fetchJugadores();
        return res.data;
      } catch (err) {
        throw err.response?.data?.error || 'Error al actualizar jugador';
      }
    },

    async eliminarJugador(id) {
      try {
        await api.delete(`/jugadores/${id}`);
        await this.fetchJugadores();
      } catch (err) {
        throw err.response?.data?.error || 'Error al eliminar jugador';
      }
    }
  }
});