import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import './reset.scss'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// import nav_top from '@/components/top/nav_top.vue'
import player from '@/components/player/player.vue'
// import player_bottom from '@/components/player/player_bottom.vue'
// import music_list from '@/components/music_list/music_list.vue'

const app = createApp(App);
// app.component('nav_top',nav_top);
// app.component('music_list',music_list);
// app.component('player_bottom',player_bottom);
app.component('player',player);

app.use(ElementPlus);
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app');