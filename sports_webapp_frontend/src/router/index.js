import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

import LoginView from '@/views/LoginView.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import DashboardView from '@/views/DashboardView.vue';
import JugadoresView from '@/views/JugadoresView.vue';
import RostersView from '@/views/RostersView.vue';

const routes = [
  { path: '/login', name: 'login', component: LoginView },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: DashboardView },
      { path: 'jugadores', name: 'jugadores', component: JugadoresView },
      { path: 'rosters', name: 'rosters', component: RostersView }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'login' });
    }
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    return next({ name: 'dashboard' });
  }

  next();
});

export default router;