// src/composables/useHttp.ts
import { inject } from 'vue'
import type { http as HttpType } from '@/utils/http'

export function useHttp() {
  const http = inject('http') as typeof HttpType
  if (!http) {
    throw new Error('http 没有被 provide，请检查 main.ts 是否 app.provide("http", http)')
  }
  return http
}
