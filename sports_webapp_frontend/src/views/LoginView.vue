<template>
  <v-container class="fill-height bg-grey-lighten-4" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-10 rounded-lg">
          <v-card-item class="bg-indigo-darken-3 text-white text-center py-6">
            <v-icon icon="mdi-shield-crown" size="48" class="mb-2" />
            <v-card-title class="text-h5 font-weight-bold">
              Panel eSports
            </v-card-title>
            <v-card-subtitle class="text-caption text-indigo-lighten-4">
              Control de jugadores y rosters
            </v-card-subtitle>
          </v-card-item>

          <v-card-text class="pt-6 px-6">
            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              closable
              class="mb-4 text-caption"
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <v-form @submit.prevent="handleLogin" ref="formRef">
              <v-text-field
                v-model="email"
                label="Correo electrónico de administrador"
                prepend-inner-icon="mdi-email-outline"
                variant="outlined"
                density="comfortable"
                :rules="[v => !!v || 'El correo es requerido']"
                required
              />

              <v-text-field
                v-model="apiKey"
                label="API Key del servidor"
                prepend-inner-icon="mdi-key-outline"
                variant="outlined"
                density="comfortable"
                type="password"
                class="mt-2"
                hint="Ingresa la clave secreta configurada"
                persistent-hint
                :rules="[
                  v => !!v?.trim() || 'La API Key es obligatoria'
                ]"
                required
              />

              <v-btn
                type="submit"
                color="indigo-darken-2"
                block
                size="large"
                class="mt-6 font-weight-bold"
                :loading="loading"
                :disabled="loading || !email.trim() || !apiKey.trim()"
              >
                Ingresar al Sistema
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions
            class="justify-center pb-4 text-caption text-grey-darken-1"
          >
            Meta 3.4 - Autorización de servicios (NODE.JS + VUE/VUETIFY)
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const email = ref('alexis@uabc.edu.mx');

// Es preferible comenzar sin una API Key precargada.
const apiKey = ref('');

const loading = ref(false);
const errorMessage = ref('');
const formRef = ref(null);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  // Bloquear el acceso si falta el correo o la API Key.
  if (!email.value.trim()) {
    errorMessage.value = 'El correo electrónico es obligatorio.';
    return;
  }

  if (!apiKey.value.trim()) {
    errorMessage.value = 'Debes ingresar la API Key para continuar.';
    return;
  }

  if (loading.value) return;

  loading.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(email.value.trim(), apiKey.value.trim());
    await router.push({ name: 'dashboard' });
  } catch (err) {
    errorMessage.value =
      typeof err === 'string'
        ? err
        : 'Credenciales no válidas';
  } finally {
    loading.value = false;
  }
};
</script>