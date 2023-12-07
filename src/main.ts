import './assets/css/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice';

//theme
import "primevue/resources/primevue.min.css"; // core CSS
import "primevue/resources/themes/lara-light-green/theme.css";
import 'primeicons/primeicons.css'; // icons
import "/node_modules/primeflex/primeflex.css"; // primeflex

const app = createApp(App);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(createPinia());
app.use(router);

app.directive('tooltip', Tooltip);

app.mount('#app')
