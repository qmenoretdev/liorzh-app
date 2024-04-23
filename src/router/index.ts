import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from "@/stores/auth";
import MonitoringUpdate from '@/components/monitoring/MonitoringUpdate.vue';
import MonitoringPanel from '@/components/monitoring/MonitoringPanel.vue';
import MonitoringCreate from '@/components/monitoring/MonitoringCreate.vue';
import MonitoringLineUpdate from '@/components/monitoringline/MonitoringLineUpdate.vue';
import MonitoringLineCreate from '@/components/monitoringline/MonitoringLineCreate.vue';
import PlotUpdate from '@/components/plot/PlotUpdate.vue';
import PlotCreate from '@/components/plot/PlotCreate.vue';
import VarietyUpdate from '@/components/variety/VarietyUpdate.vue';
import VarietyCreate from '@/components/variety/VarietyCreate.vue';
import SowingUpdate from '@/components/sowing/SowingUpdate.vue';
import SowingCreate from '@/components/sowing/SowingCreate.vue';
import ProjectUpdate from '@/components/project/ProjectUpdate.vue';
import ProjectCreate from '@/components/project/ProjectCreate.vue';
import ProjectAddUser from '@/components/project/ProjectAddUser.vue';
import ProjectPanel from '@/components/project/ProjectPanel.vue';

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
        path: '/plot/create',
        name: 'PlotCreate',
        component: PlotCreate,
      },
      {
        path: '/plot/update/:id',
        name: 'PlotUpdate',
        props: true,
        component: PlotUpdate,
      },
      {
        path: '/variety',
        name: 'VarietyPanel',
        component: () => import('@/components/variety/VarietyPanel.vue')
      },
      {
        path: '/variety/update/:id',
        name: 'VarietyUpdate',
        props: true,
        component: VarietyUpdate,
      },
      {
        path: '/variety/create',
        name: 'VarietyCreate',
        component: VarietyCreate,
      },
      {
        path: '/sowing',
        name: 'SowingPanel',
        component: () => import('@/components/sowing/SowingPanel.vue')
      },
      {
        path: '/sowing/update/:id',
        name: 'SowingUpdate',
        props: true,
        component: SowingUpdate,
      },
      {
        path: '/sowing/create',
        name: 'SowingCreate',
        component: SowingCreate,
      },
    ]
  },
  {
    path: '/project',
    name: 'project',
    component: () => import('@/views/ProjectView.vue'),
    redirect: () => { return '/user-projects'},
    children: [
      {
        path: '/user-projects',
        name: 'ProjectPanel',
        component: ProjectPanel,
      },
      {
        path: '/project/update/:id',
        name: 'ProjectUpdate',
        props: true,
        component: ProjectUpdate,
      },
      {
        path: '/project/create',
        name: 'ProjectCreate',
        component: ProjectCreate,
      },
      {
        path: '/project/add-user/:id',
        name: 'ProjectAddUser',
        props: true,
        component: ProjectAddUser,
      },
    ]
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
