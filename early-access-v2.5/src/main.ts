import { createApp } from 'vue'
import ElementPlus from 'element-plus' 
import 'element-plus/dist/index.css'
import App from './App.vue'
import './reset.scss'

const app = createApp(App)

import player from "./components/player/player.vue"

app.component("player", player);
app.use(ElementPlus)
app.mount('#app')