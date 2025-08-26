// src/components/password/index.ts
import { useMessageStore } from '@/store/modules/Message'

export interface PasswordPopupOptions {
  show?: boolean
  title?: string
  password?: string
  confirm?: (password: string) => void
}

export function passwordPopup(options: PasswordPopupOptions = {}) {
  const store = useMessageStore()

  // 打开弹窗 & 写入基础配置
  store.changePasswordPopConfig({
    show: options.show ?? true,
    title: options.title ?? '',
    password: options.password ?? ''
  })


}


