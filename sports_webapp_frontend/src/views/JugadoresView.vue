<template>
  <div>
    <v-row class="mb-4" align="center">
      <v-col cols="12" md="6">
        <h1 class="text-h4 font-weight-bold text-indigo-darken-3">
          Gestión de Jugadores
        </h1>
        <p class="text-body-2 text-grey-darken-1">
          Registro y mantenimiento de perfiles de competidores eSports.
        </p>
      </v-col>
      <v-col cols="12" md="6" class="text-md-right">
        <v-btn
          color="indigo-darken-2"
          prepend-icon="mdi-account-plus"
          size="large"
          @click="openDialog()"
        >
          Nuevo Jugador
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-card class="mb-6 pa-4 rounded-lg" elevation="1">
      <v-row density="compact">
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="filters.search"
            label="Buscar por Nickname"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            clearable
            @update:model-value="applyFilters"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filters.rol"
            :items="['Todos', ...jugadoresStore.roles]"
            label="Filtrar por Rol"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="applyFilters"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="filters.estado"
            :items="['Todos', ...jugadoresStore.estados]"
            label="Filtrar por Estado"
            variant="outlined"
            density="compact"
            hide-details
            @update:model-value="applyFilters"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- Tabla -->
    <v-card class="rounded-lg" elevation="2">
      <v-data-table
        :headers="headers"
        :items="jugadoresStore.jugadores"
        :loading="jugadoresStore.loading"
        :items-per-page="-1"
        hide-default-footer
        no-data-text="No se encontraron jugadores registrados"
        class="elevation-0"
      >
        <template v-slot:item.nickname="{ item }">
          <span class="font-weight-bold text-indigo-darken-2">
            {{ item.nickname }}
          </span>
        </template>

        <template v-slot:item.rol="{ item }">
          <v-chip
            :color="getRoleColor(item.rol)"
            size="small"
            label
            font-weight-bold
          >
            {{ item.rol }}
          </v-chip>
        </template>

        <template v-slot:item.estado="{ item }">
          <v-chip
            :color="item.estado?.toLowerCase() === 'activo' ? 'success' : 'grey'"
            size="x-small"
            class="text-uppercase font-weight-bold"
          >
            {{ item.estado }}
          </v-chip>
        </template>

        <template v-slot:item.acciones="{ item }">
          <v-btn
            icon
            size="small"
            variant="text"
            color="blue"
            @click="openDialog(item)"
          >
            <v-icon icon="mdi-pencil"></v-icon>
          </v-btn>
          <v-btn
            icon
            size="small"
            variant="text"
            color="red"
            @click="confirmDelete(item)"
          >
            <v-icon icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Modal Formulario -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card class="rounded-lg">
        <v-card-title class="bg-indigo-darken-2 text-white">
          {{ isEditing ? 'Editar Jugador' : 'Registrar Nuevo Jugador' }}
        </v-card-title>
        <v-card-text class="pt-4">
          <v-alert v-if="formError" type="error" variant="tonal" class="mb-4 text-caption">
            {{ formError }}
          </v-alert>

          <v-form ref="formRef">
            <v-text-field
              v-model="formData.nickname"
              label="Nickname (RN-01 Único)"
              variant="outlined"
              density="comfortable"
              required
            ></v-text-field>

            <v-text-field
              v-model="formData.nombre_real"
              label="Nombre Real"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <v-text-field
              v-model="formData.pais"
              label="País de Origen"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <v-select
              v-model="formData.rol"
              :items="jugadoresStore.roles"
              label="Posición / Rol"
              variant="outlined"
              density="comfortable"
              required
            ></v-select>

            <v-select
              v-model="formData.estado"
              :items="jugadoresStore.estados"
              label="Estado"
              variant="outlined"
              density="comfortable"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">Cancelar</v-btn>
          <v-btn color="indigo-darken-2" variant="elevated" :loading="saving" @click="saveJugador">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal Confirmación Eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card class="rounded-lg">
        <v-card-title class="text-h6 font-weight-bold">¿Confirmar Eliminación?</v-card-title>
        <v-card-text>
          ¿Deseas eliminar permanentemente al jugador <strong>{{ selectedJugador?.nickname }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="red-darken-1" variant="elevated" @click="executeDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useJugadoresStore } from '@/stores/jugadores';

const jugadoresStore = useJugadoresStore();

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nickname', key: 'nickname' },
  { title: 'Nombre Real', key: 'nombre_real' },
  { title: 'País', key: 'pais' },
  { title: 'Rol en Juego', key: 'rol' },
  { title: 'Estado', key: 'estado' },
  { title: 'Acciones', key: 'acciones', sortable: false, align: 'end' }
];

const filters = reactive({
  search: '',
  rol: 'Todos',
  estado: 'Todos'
});

const dialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const formError = ref('');
const selectedJugador = ref(null);

const formData = reactive({
  id: null,
  nickname: '',
  nombre_real: '',
  pais: '',
  rol: 'Mid',
  estado: 'Activo'
});

onMounted(() => {
  jugadoresStore.fetchAuxiliares();
  applyFilters();
});

const applyFilters = () => {
  const query = {
    search: filters.search || undefined,
    rol: filters.rol !== 'Todos' ? filters.rol : undefined,
    estado: filters.estado !== 'Todos' ? filters.estado : undefined
  };
  jugadoresStore.fetchJugadores(query);
};

const getRoleColor = (rol) => {
  const map = { Top: 'deep-orange', Jungle: 'green', Mid: 'purple', ADC: 'blue', Support: 'teal' };
  return map[rol] || 'grey';
};

const openDialog = (jugador = null) => {
  formError.value = '';
  if (jugador) {
    isEditing.value = true;
    formData.id = jugador.id;
    formData.nickname = jugador.nickname;
    formData.nombre_real = jugador.nombre_real;
    formData.pais = jugador.pais;
    formData.rol = jugador.rol;
    formData.estado = jugador.estado;
  } else {
    isEditing.value = false;
    formData.id = null;
    formData.nickname = '';
    formData.nombre_real = '';
    formData.pais = '';
    formData.rol = 'Mid';
    formData.estado = 'Activo';
  }
  dialog.value = true;
};

const saveJugador = async () => {
  if (!formData.nickname) {
    formError.value = 'El nickname es obligatorio';
    return;
  }
  saving.value = true;
  formError.value = '';

  try {
    if (isEditing.value) {
      await jugadoresStore.actualizarJugador(formData.id, formData);
    } else {
      await jugadoresStore.crearJugador(formData);
    }
    dialog.value = false;
  } catch (err) {
    formError.value = err;
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (jugador) => {
  selectedJugador.value = jugador;
  deleteDialog.value = true;
};

const executeDelete = async () => {
  if (!selectedJugador.value) return;
  try {
    await jugadoresStore.eliminarJugador(selectedJugador.value.id);
    deleteDialog.value = false;
  } catch (err) {
    alert(err);
  }
};
</script>