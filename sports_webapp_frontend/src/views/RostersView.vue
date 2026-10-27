<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold text-indigo-darken-3">
          Gestion de Rosters
        </h1>
        <p class="text-body-2 text-grey-darken-1">
          Configuración e integración de alineaciones para torneos.
        </p>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="indigo-darken-2"
          prepend-icon="mdi-plus-box"
          size="large"
          @click="openRosterDialog()"
        >
          Crear Roster
        </v-btn>
      </v-col>
    </v-row>

    <!-- Rosters Grid -->
    <v-col>
      <v-col
        v-for="roster in rostersStore.rosters"
        :key="roster.id"
        cols="12"
        md="6"
        lg="12"
      >
        <v-card class="rounded-lg elevation-2 hover-card">
          <v-card-item class="bg-indigo-lighten-5">
            <template v-slot:append>
              <v-chip
                size="small"
                :color="roster.tipo === 'Principal' ? 'deep-purple' : 'teal'"
                class="font-weight-bold"
              >
                {{ roster.tipo }}
              </v-chip>
            </template>
            <v-card-title class="font-weight-bold text-indigo-darken-4">
              {{ roster.nombre }}
            </v-card-title>
            <v-card-subtitle>
              {{ roster.juego }} | Temporada: {{ roster.temporada }}
            </v-card-subtitle>
          </v-card-item>

          <v-divider></v-divider>

          <v-card-text class="py-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <v-chip size="medium" color="indigo" variant="tonal" class="w-100 px-3" rounded="lg">
                {{ roster.cantidad_jugadores }} jugador(es) registrado(s)
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions class="px-4 pb-4">
            <v-btn
              color="indigo-darken-2"
              variant="tonal"
              prepend-icon="mdi-account-cog"
              size="small"
              @click="openDetalleRoster(roster.id)"
            >
              Gestionar Alineación
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon size="small" variant="text" color="blue" @click="openRosterDialog(roster)">
              <v-icon icon="mdi-pencil"></v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text" color="red" @click="confirmDeleteRoster(roster)">
              <v-icon icon="mdi-delete"></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-col>

    <!-- Drawer / Modal para gestionar la plantilla del Roster seleccionada -->
    <v-dialog v-model="detalleDialog" max-width="800px">
      <v-card class="rounded-lg" v-if="rostersStore.rosterActual">
        <v-card-title class="bg-indigo-darken-3 text-white d-flex align-center">
          <span>Alineación: {{ rostersStore.rosterActual.nombre }}</span>
          <v-spacer></v-spacer>
          <v-btn icon variant="text" color="white" @click="detalleDialog = false">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-row align="center" class="mb-4">
            <v-col cols="12" sm="8">
              <h3 class="text-subtitle-1 font-weight-bold">Jugadores Asignados</h3>
              <p class="text-caption text-grey-darken-1">
                RN-02: Máximo 5 titulares. RN-03: Posición única por titular.
              </p>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right">
              <v-btn
                color="indigo"
                prepend-icon="mdi-account-plus"
                size="small"
                @click="openAsignarDialog()"
              >
                Añadir Jugador
              </v-btn>
            </v-col>
          </v-row>

          <v-table class="elevation-1 rounded">
            <thead>
              <tr>
                <th>Nickname</th>
                <th>Rol de Juego</th>
                <th>Rol en Roster</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="j in rostersStore.rosterActual.jugadores" :key="j.id">
                <td class="font-weight-bold">{{ j.nickname }}</td>
                <td>
                  <v-chip size="x-small" color="primary">{{ j.rol }}</v-chip>
                </td>
                <td>
                  <v-chip
                    size="x-small"
                    :color="j.rol_en_roster === 'Titular' ? 'success' : 'warning'"
                  >
                    {{ j.rol_en_roster }}
                  </v-chip>
                </td>
                <td class="text-end">
                  <v-btn
                    size="x-small"
                    variant="tonal"
                    color="deep-purple"
                    class="mr-2"
                    @click="toggleRolJugador(j)"
                  >
                    Cambiar a {{ j.rol_en_roster === 'Titular' ? 'Suplente' : 'Titular' }}
                  </v-btn>
                  <v-btn icon size="x-small" color="red" variant="text" @click="quitarJugador(j.id)">
                    <v-icon icon="mdi-account-remove"></v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr v-if="!rostersStore.rosterActual.jugadores?.length">
                <td colspan="4" class="text-center py-4 text-grey">
                  No hay jugadores asignados a este roster.
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal Asignar Jugador -->
    <v-dialog v-model="asignarDialog" max-width="450px">
      <v-card class="rounded-lg">
        <v-card-title class="bg-indigo-darken-2 text-white">Asignar Jugador</v-card-title>
        <v-card-text class="pt-4">
          <v-alert v-if="asignarError" type="error" variant="tonal" class="mb-4 text-caption">
            {{ asignarError }}
          </v-alert>

          <v-select
            v-model="selectedJugadorId"
            :items="jugadoresStore.jugadores"
            item-title="nickname"
            item-value="id"
            label="Seleccionar Jugador"
            variant="outlined"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="`Rol: ${item.raw.rol}`"></v-list-item>
            </template>
          </v-select>

          <v-select
            v-model="selectedRolEnRoster"
            :items="['Titular', 'Suplente']"
            label="Rol en el Roster"
            variant="outlined"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="asignarDialog = false">Cancelar</v-btn>
          <v-btn color="indigo" variant="elevated" :loading="asignando" @click="confirmarAsignacion">
            Asignar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal para Crear / Editar Roster -->
    <RosterFormDialog
      v-model="rosterDialog"
      :roster="selectedRoster"
      @saved="rostersStore.fetchRosters()"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRostersStore } from '@/stores/rosters';
import { useJugadoresStore } from '@/stores/jugadores';
import RosterFormDialog from '@/components/RosterFormDialog.vue'; // 1. Importar componente

const rostersStore = useRostersStore();
const jugadoresStore = useJugadoresStore();

// Estados reactivos para la creación y edición
const rosterDialog = ref(false);
const selectedRoster = ref(null);

const detalleDialog = ref(false);
const asignarDialog = ref(false);
const asignando = ref(false);
const asignarError = ref('');

const selectedJugadorId = ref(null);
const selectedRolEnRoster = ref('Titular');

onMounted(() => {
  rostersStore.fetchRosters();
  jugadoresStore.fetchJugadores();
});

const openDetalleRoster = async (id) => {
  await rostersStore.fetchRosterDetalle(id);
  detalleDialog.value = true;
};

const openAsignarDialog = () => {
  asignarError.value = '';
  selectedJugadorId.value = null;
  selectedRolEnRoster.value = 'Titular';
  asignarDialog.value = true;
};

const confirmarAsignacion = async () => {
  if (!selectedJugadorId.value) {
    asignarError.value = 'Selecciona un jugador';
    return;
  }
  asignando.value = true;
  asignarError.value = '';

  try {
    await rostersStore.asignarJugador(
      rostersStore.rosterActual.id,
      selectedJugadorId.value,
      selectedRolEnRoster.value
    );
    asignarDialog.value = false;
  } catch (err) {
    asignarError.value = err;
  } finally {
    asignando.value = false;
  }
};

const toggleRolJugador = async (jugador) => {
  const nuevoRol = jugador.rol_en_roster === 'Titular' ? 'Suplente' : 'Titular';
  try {
    await rostersStore.cambiarRolJugador(
      rostersStore.rosterActual.id,
      jugador.id,
      nuevoRol
    );
  } catch (err) {
    alert(err);
  }
};

const quitarJugador = async (idJugador) => {
  try {
    await rostersStore.quitarJugador(rostersStore.rosterActual.id, idJugador);
  } catch (err) {
    alert(err);
  }
};

const openRosterDialog = (roster = null) => {
  selectedRoster.value = roster ? { ...roster } : null;
  rosterDialog.value = true;
};

const confirmDeleteRoster = async (roster) => {
  if (confirm(`¿Eliminar roster ${roster.nombre}? (RN-05: Los jugadores no serán eliminados)`)) {
    await rostersStore.eliminarRoster(roster.id);
  }
};
</script>