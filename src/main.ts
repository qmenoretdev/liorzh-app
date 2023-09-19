import './assets/css/global.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
//theme
import "primevue/resources/primevue.min.css"; // core CSS
import "primevue/resources/themes/bootstrap4-light-blue/theme.css"; // theme
import 'primeicons/primeicons.css'; // icons
import "/node_modules/primeflex/primeflex.css"; // primeflex

const app = createApp(App)
app.use(PrimeVue);
app.use(createPinia())
app.use(router)

app.mount('#app')
