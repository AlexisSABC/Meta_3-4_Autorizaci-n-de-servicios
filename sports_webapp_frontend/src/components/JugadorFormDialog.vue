<template>
  <v-dialog :model-value="modelValue" @update:model-value="closeDialog" max-width="500px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="bg-indigo-darken-2 text-white px-4 py-3 d-flex align-center">
        <v-icon :icon="isEditing ? 'mdi-account-edit' : 'mdi-account-plus'" class="mr-2"></v-icon>
        <span>{{ isEditing ? 'Editar Jugador' : 'Nuevo Jugador' }}</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" density="comfortable" color="white" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4 text-caption" closable @click:close="errorMessage = ''">
          {{ errorMessage }}
        </v-alert>

        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.nickname"
            label="Nickname *"
            hint="Identificador único del jugador (RN-01)"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'El nickname es obligatorio']"
            required
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="form.nombre_real"
            label="Nombre Real"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="form.pais"
            label="País de Origen"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          ></v-text-field>

          <v-select
            v-model="form.rol"
            :items="roles"
            label="Posición / Rol *"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'Selecciona un rol válido']"
            required
            class="mb-2"
          ></v-select>

          <v-select
            v-model="form.estado"
            :items="estados"
            label="Estado *"
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
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          {{ isEditing ? 'Actualizar' : 'Guardar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, reactive, computed } from 'vue';
import { useJugadoresStore } from '@/stores/jugadores';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  jugador: { type: Object, default: null }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const jugadoresStore = useJugadoresStore();
const formRef = ref(null);
const isFormValid = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
const estados = ['Activo', 'Inactivo'];

const isEditing = computed(() => !!props.jugador?.id);

const form = reactive({
  id: null,
  nickname: '',
  nombre_real: '',
  pais: '',
  rol: 'Mid',
  estado: 'Activo'
});

watch(
  () => props.jugador,
  (newVal) => {
    if (newVal) {
      form.id = newVal.id;
      form.nickname = newVal.nickname || '';
      form.nombre_real = newVal.nombre_real || '';
      form.pais = newVal.pais || '';
      form.rol = newVal.rol || 'Mid';
      form.estado = newVal.estado || 'Activo';
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function resetForm() {
  form.id = null;
  form.nickname = '';
  form.nombre_real = '';
  form.pais = '';
  form.rol = 'Mid';
  form.estado = 'Activo';
  errorMessage.value = '';
}

function closeDialog() {
  emit('update:modelValue', false);
  resetForm();
}

async function handleSubmit() {
  if (!formRef.value) return;
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    if (isEditing.value) {
      await jugadoresStore.actualizarJugador(form.id, {
        nickname: form.nickname,
        nombre_real: form.nombre_real,
        pais: form.pais,
        rol: form.rol,
        estado: form.estado
      });
    } else {
      await jugadoresStore.crearJugador({
        nickname: form.nickname,
        nombre_real: form.nombre_real,
        pais: form.pais,
        rol: form.rol,
        estado: form.estado
      });
    }
    emit('saved');
    closeDialog();
  } catch (err) {
    errorMessage.value = typeof err === 'string' ? err : 'Error al procesar la solicitud';
  } finally {
    loading.value = false;
  }
}
</script>