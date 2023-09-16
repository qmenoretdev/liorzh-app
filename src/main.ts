import './assets/css/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
//theme
import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
import 'primeicons/primeicons.css';

const app = createApp(App)
app.use(PrimeVue);
app.use(createPinia())
app.use(router)

app.mount('#app')
