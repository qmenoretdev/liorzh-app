import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/stores/auth";

const securedRoutes = [
  {
    path: '/profil',
    name: 'profil',
    component: () => import('@/views/ProfilView.vue'),
  },
  {
    path: '/workspace',
    name: 'workspace',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/WorkspaceView.vue')
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...securedRoutes,
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/SignupView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/no-authenticated',
      name: 'noAuthenticated',
      component: () => import('@/views/NoAuthenticatedView.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (securedRoutes.find((route) => route.name === to.name)) {
    const authStore = useAuthStore();
    if (authStore.authenticated) {
      if (!hasPermissionsNeeded(to)) {
        next('/page-to-show-for-no-permission');
        return;
      }
    } else {
      next({ name: 'noAuthenticated'});
      return;
    }
  }
  next();
  return;
})

function hasPermissionsNeeded(to: any) {
  return true;
}

export default router
