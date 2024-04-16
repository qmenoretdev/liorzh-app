import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import MonitoringUpdate from '@/components/monitoring/MonitoringUpdate.vue';
import MonitoringPanel from '@/components/monitoring/MonitoringPanel.vue';
import MonitoringCreate from '@/components/monitoring/MonitoringCreate.vue';
import MonitoringLineUpdate from '@/components/monitoringline/MonitoringLineUpdate.vue';
import MonitoringLineCreate from '@/components/monitoringline/MonitoringLineCreate.vue';

const securedRoutes = [
  {
    path: '/profil',
    name: 'profil',
    component: () => import('@/views/ProfilView.vue'),
  },
  {
    path: '/workspace',
    name: 'workspace',
    redirect: () => { return '/monitoring'},
    component: () => import('@/views/WorkspaceView.vue'),
    children: [
      {
        path: '/monitoring',
        name: 'MonitoringPanel',
        component: MonitoringPanel,
      },
      {
        path: '/monitoring/update/:id',
        name: 'MonitoringUpdate',
        props: true,
        component: MonitoringUpdate,
      },
      {
        path: '/monitoring/create',
        name: 'MonitoringCreate',
        component: MonitoringCreate,
      },
      {
        path: '/monitoring-line/create',
        name: 'MonitoringLineCreate',
        component: MonitoringLineCreate,
      },
      {
        path: '/monitoring-line/update/:id',
        name: 'MonitoringLineUpdate',
        props: true,
        component: MonitoringLineUpdate,
      },
      {
        path: '/variety',
        name: 'VarietyPanel',
        component: () => import('@/components/variety/VarietyPanel.vue')
      },
      {
        path: '/sowing',
        name: 'SowingPanel',
        component: () => import('@/components/sowing/SowingPanel.vue')
      },
    ]
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('@/views/ProjectView.vue')
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
