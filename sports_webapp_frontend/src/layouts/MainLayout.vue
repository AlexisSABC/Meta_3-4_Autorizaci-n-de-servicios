<template>
  <v-app>
    <v-app-bar color="indigo-darken-3" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon icon="mdi-gamepad-variant" class="mr-2"></v-icon>
        Meta 3.4 - Autorizacion de servicios
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="d-none d-sm-flex align-center mr-4" v-if="authStore.user">
        <v-avatar color="indigo-lighten-2" size="32" class="mr-2 text-caption font-weight-bold">
          {{ authStore.user.name?.charAt(0) || 'A' }}
        </v-avatar>
        <span class="text-body-2 font-weight-medium">{{ authStore.user.name }}</span>
        <v-chip size="x-small" color="amber-darken-2" class="ml-2 font-weight-bold">
          {{ authStore.user.role }}
        </v-chip>
      </div>

      <v-btn icon title="Cerrar Sesión" @click="handleLogout">
        <v-icon icon="mdi-logout"></v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" permanent>
      <v-list density="compact" nav class="mt-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard-outline"
          title="Dashboard"
          value="dashboard"
          to="/"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-group-outline"
          title="Jugadores"
          value="jugadores"
          to="/jugadores"
        ></v-list-item>
        <v-list-item
          prepend-icon="mdi-account-box-multiple-outline"
          title="Rosters"
          value="rosters"
          to="/rosters"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-6">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const drawer = ref(true);
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: 'login' });
};
</script>