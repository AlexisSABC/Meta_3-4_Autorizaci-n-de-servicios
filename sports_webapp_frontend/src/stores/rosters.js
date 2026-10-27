import { defineStore } from 'pinia';
import api from '@/services/api';

export const useRostersStore = defineStore('rosters', {
  state: () => ({
    rosters: [],
    rosterActual: null,
    tiposRoster: ['Principal', 'Academy'],
    loading: false,
    error: null
  }),
  actions: {
    async fetchTiposRoster() {
      try {
        const res = await api.get('/tipos-roster');
        this.tiposRoster = res.data;
      } catch (err) {
        console.error('Error cargando tipos de roster:', err);
      }
    },

    async fetchRosters(filters = {}) {
      this.loading = true;
      try {
        const params = new URLSearchParams();
        if (filters.tipo) params.append('tipo', filters.tipo);
        if (filters.temporada) params.append('temporada', filters.temporada);

        const res = await api.get(`/rosters?${params.toString()}`);
        this.rosters = res.data;
      } catch (err) {
        this.error = err.response?.data?.error || 'Error al obtener rosters';
      } finally {
        this.loading = false;
      }
    },

    async fetchRosterDetalle(id) {
      this.loading = true;
      try {
        const res = await api.get(`/rosters/${id}`);
        this.rosterActual = res.data;
        return res.data;
      } catch (err) {
        throw err.response?.data?.error || 'Error al obtener detalle del roster';
      } finally {
        this.loading = false;
      }
    },

    async crearRoster(data) {
      try {
        const res = await api.post('/rosters', data);
        await this.fetchRosters();
        return res.data;
      } catch (err) {
        throw err.response?.data?.error || 'Error al crear roster';
      }
    },

    async actualizarRoster(id, data) {
      try {
        const res = await api.put(`/rosters/${id}`, data);
        await this.fetchRosters();
        return res.data;
      } catch (err) {
        throw err.response?.data?.error || 'Error al actualizar roster';
      }
    },

    async eliminarRoster(id) {
      try {
        await api.delete(`/rosters/${id}`);
        await this.fetchRosters();
      } catch (err) {
        throw err.response?.data?.error || 'Error al eliminar roster';
      }
    },

    async asignarJugador(idRoster, idJugador, rolEnRoster) {
      try {
        const res = await api.post(`/rosters/${idRoster}/jugadores`, {
          id_jugador: idJugador,
          rol_en_roster: rolEnRoster
        });
        await this.fetchRosterDetalle(idRoster);
        return res.data;
      } catch (err) {
        throw err.response?.data?.error || 'Error al asignar jugador';
      }
    },

    async cambiarRolJugador(idRoster, idJugador, rolEnRoster) {
      try {
        const res = await api.put(`/rosters/${idRoster}/jugadores/${idJugador}`, {
          rol_en_roster: rolEnRoster
        });
        await this.fetchRosterDetalle(idRoster);
        return res.data;
      } catch (err) {
        throw err.response?.data?.error || 'Error al actualizar rol en el roster';
      }
    },

    async quitarJugador(idRoster, idJugador) {
      try {
        await api.delete(`/rosters/${idRoster}/jugadores/${idJugador}`);
        await this.fetchRosterDetalle(idRoster);
      } catch (err) {
        throw err.response?.data?.error || 'Error al remover jugador del roster';
      }
    }
  }
});