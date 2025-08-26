// src/types/shims-vue.d.ts

/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'uview-plus'


// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $PasswordPopup: (options: {
//       show?: boolean
//       title?: string
//       password?: string
//       confirm?: (pwd: string) => void
//     }) => void
//   }
// }
