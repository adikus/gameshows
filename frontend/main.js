import './css/main.scss'
import 'floating-vue/dist/style.css'

import { createApp } from 'vue'
import Vue3Sanitize from "vue-3-sanitize"
import FloatingVue from 'floating-vue'

import App from './App.vue'
import JoinApp from './JoinApp.vue'

if (document.getElementById('app')) {
    const app = createApp(App)
    app.use(Vue3Sanitize, { allowedTags: ['br'] })
    app.use(FloatingVue)
    app.mount('#app')
}

if (document.getElementById('app-join')) {
    const app = createApp(JoinApp)
    app.use(Vue3Sanitize, { allowedTags: ['br'] })
    app.use(FloatingVue)
    app.mount('#app-join')
}


