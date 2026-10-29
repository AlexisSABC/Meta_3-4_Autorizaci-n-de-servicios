<template>
  <v-dialog :model-value="modelValue" @update:model-value="closeDialog" max-width="480px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="bg-indigo-darken-2 text-white px-4 py-3 d-flex align-center">
        <v-icon icon="mdi-account-plus" class="mr-2"></v-icon>
        <span>Asignar Jugador al Roster</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" density="comfortable" color="white" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4 text-caption" closable @click:close="errorMessage = ''">
          {{ errorMessage }}
        </v-alert>

        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleAssign">
          <v-autocomplete
            v-model="idJugador"
            :items="jugadoresDisponibles"
            item-title="nickname"
            item-value="id"
            label="Buscar Jugador *"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Debes seleccionar un jugador']"
            required
            class="mb-2"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :subtitle="`Posición: ${item.raw.rol} | Estado: ${item.raw.estado}`"></v-list-item>
            </template>
          </v-autocomplete>

          <v-select
            v-model="rolEnRoster"
            :items="rolesEnRoster"
            label="Rol en el Roster *"
            variant="outlined"
            density="comfortable"
            required
          ></v-select>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="closeDialog">Cancelar</v-btn>
        <v-btn
          color="indigo-darken-2"
          variant="elevated"
          :loading="loading"
          :disabled="!isFormValid || !idJugador"
          @click="handleAssign"
        >
          Asignar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRostersStore } from '@/stores/rosters';
import { useJugadoresStore } from '@/stores/jugadores';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  rosterId: { type: [Number, String], required: true }
});

const emit = defineEmits(['update:modelValue', 'assigned']);

const rostersStore = useRostersStore();
const jugadoresStore = useJugadoresStore();

const formRef = ref(null);
const isFormValid = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const idJugador = ref(null);
const rolEnRoster = ref('Titular');

const rolesEnRoster = ['Titular', 'Suplente'];

onMounted(() => {
  if (!jugadoresStore.jugadores.length) {
    jugadoresStore.fetchJugadores();
  }
});

const jugadoresDisponibles = computed(() => {
  const asignadosIds = rostersStore.rosterActual?.jugadores?.map(j => j.id) || [];
  return jugadoresStore.jugadores.filter(j => !asignadosIds.includes(j.id));
});

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      idJugador.value = null;
      rolEnRoster.value = 'Titular';
      errorMessage.value = '';
    }
  }
);

function closeDialog() {
  emit('update:modelValue', false);
  idJugador.value = null;
  errorMessage.value = '';
}

async function handleAssign() {
  if (!idJugador.value) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    await rostersStore.asignarJugador(props.rosterId, idJugador.value, rolEnRoster.value);
    emit('assigned');
    closeDialog();
  } catch (err) {
    // Captura los errores de negocio RN-02 (Máximo 5 titulares) y RN-03 (Rol duplicado)
    errorMessage.value = typeof err === 'string' ? err : 'Error al asignar el jugador';
  } finally {
    loading.value = false;
  }
}
</script>