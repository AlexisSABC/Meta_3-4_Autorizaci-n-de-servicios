<template>
  <div>
    <h1 class="text-h4 font-weight-bold text-indigo-darken-3 mb-4">
      Resumen de la base de datos
    </h1>

    <v-col>
      <v-col cols="12" sm="8" md="12">
        <v-card class="pa-4 rounded-lg elevation-2 bg-indigo-darken-2 text-white">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-group" size="60" class="mr-3"></v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ jugadoresStore.jugadores.length }}</div>
              <div class="text-caption">Jugadores totales</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="8" md="12">
        <v-card class="pa-4 rounded-lg elevation-2 bg-teal-darken-1 text-white">
          <div class="d-flex align-center">
            <v-icon icon="mdi-account-check" size="60" class="mr-3"></v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ activosCount }}</div>
              <div class="text-caption">Jugadores activos</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" sm="8" md="12">
        <v-card class="pa-4 rounded-lg elevation-2 bg-deep-purple-darken-1 text-white">
          <div class="d-flex align-center">
            <v-icon icon="mdi-shield-account" size="60" class="mr-3"></v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ rostersStore.rosters.length }}</div>
              <div class="text-caption">Rosters configurados</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-col>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useJugadoresStore } from '@/stores/jugadores';
import { useRostersStore } from '@/stores/rosters';

const jugadoresStore = useJugadoresStore();
const rostersStore = useRostersStore();

onMounted(() => {
  jugadoresStore.fetchJugadores();
  rostersStore.fetchRosters();
});

const activosCount = computed(() => {
  return jugadoresStore.jugadores.filter(j => j.estado?.toLowerCase() === 'activo').length;
});
</script>