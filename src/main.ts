
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import './uni.promisify.adaptor'

// 工具
import { http } from '@/utils/http'

// 全局组件
import PasswordPopup from '@/components/password/index.vue'
import walletTabbar from '@/components/walletTabbar.vue'
import navigationBar from '@/components/navigationBar.vue'
import titleBar from '@/components/titleBar.vue'


const app = createApp(App)

// 使用 Pinia
const pinia = createPinia()
app.use(pinia)

// 注册全局组件
app.component('walletTabbar', walletTabbar)
app.component('navigationBar', navigationBar)
app.component('titleBar', titleBar)

// 挂载全局对象（提供/注入方式）
app.provide('http', http)
// app.provide('PasswordPopup', PasswordPopup)




// 挂载应用
app.mount('#app')



// <script setup lang="ts">
// import { inject } from 'vue'
// import type { HttpType } from '@/utils/http'

// const http = inject<HttpType>('http')!
// const PasswordPopup = inject('PasswordPopup')

// http.get('/api/demo').then(console.log)
// </script>
