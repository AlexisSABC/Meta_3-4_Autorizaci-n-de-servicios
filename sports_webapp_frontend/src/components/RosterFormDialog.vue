<template>
  <v-dialog :model-value="modelValue" @update:model-value="closeDialog" max-width="500px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="bg-indigo-darken-3 text-white px-4 py-3 d-flex align-center">
        <v-icon :icon="isEditing ? 'mdi-shield-edit' : 'mdi-shield-plus'" class="mr-2"></v-icon>
        <span>{{ isEditing ? 'Editar Roster' : 'Crear Roster' }}</span>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" density="comfortable" color="white" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text class="pt-4">
        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4 text-caption" closable @click:close="errorMessage = ''">
          {{ errorMessage }}
        </v-alert>

        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.nombre"
            label="Nombre del Roster *"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'El nombre es obligatorio']"
            required
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="form.juego"
            label="Juego *"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'El juego es obligatorio']"
            required
            class="mb-2"
          ></v-text-field>

          <v-select
            v-model="form.tipo"
            :items="tiposRoster"
            label="Tipo de Roster *"
            variant="outlined"
            density="comfortable"
            required
            class="mb-2"
          ></v-select>

          <v-text-field
            v-model="form.temporada"
            label="Temporada (Ej. 2026) *"
            variant="outlined"
            density="comfortable"
            :rules="[v => !!v || 'La temporada es obligatoria']"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="closeDialog">Cancelar</v-btn>
        <v-btn
          color="indigo-darken-3"
          variant="elevated"
          :loading="loading"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          {{ isEditing ? 'Actualizar' : 'Crear' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, reactive, computed } from 'vue';
import { useRostersStore } from '@/stores/rosters';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  roster: { type: Object, default: null }
});

const emit = defineEmits(['update:modelValue', 'saved']);

const rostersStore = useRostersStore();
const formRef = ref(null);
const isFormValid = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const tiposRoster = ['Principal', 'Academy'];

const isEditing = computed(() => !!props.roster?.id);

const form = reactive({
  id: null,
  nombre: '',
  juego: 'League of Legends',
  tipo: 'Principal',
  temporada: '2026'
});

watch(
  () => props.roster,
  (newVal) => {
    if (newVal) {
      form.id = newVal.id;
      form.nombre = newVal.nombre || '';
      form.juego = newVal.juego || 'League of Legends';
      form.tipo = newVal.tipo || 'Principal';
      form.temporada = newVal.temporada || '2026';
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function resetForm() {
  form.id = null;
  form.nombre = '';
  form.juego = 'League of Legends';
  form.tipo = 'Principal';
  form.temporada = '2026';
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
      await rostersStore.actualizarRoster(form.id, {
        nombre: form.nombre,
        juego: form.juego,
        tipo: form.tipo,
        temporada: form.temporada
      });
    } else {
      await rostersStore.crearRoster({
        nombre: form.nombre,
        juego: form.juego,
        tipo: form.tipo,
        temporada: form.temporada
      });
    }
    emit('saved');
    closeDialog();
  } catch (err) {
    errorMessage.value = typeof err === 'string' ? err : 'Error al procesar la operación';
  } finally {
    loading.value = false;
  }
}
</script>