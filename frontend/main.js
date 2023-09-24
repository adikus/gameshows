import './css/main.scss'
import 'floating-vue/dist/style.css'

import { createApp } from 'vue'
import Vue3Sanitize from "vue-3-sanitize"
import FloatingVue from 'floating-vue'

import App from './App.vue'

const app = createApp(App)
app.use(Vue3Sanitize, { allowedTags: ['br'] })
app.use(FloatingVue)
app.mount('#app')
