import { defineStore } from 'pinia';


// 从缓存中读取数据----方法封装
const getStorage = (key: string) => {
    const value = uni.getStorageSync(key);
    return value ? JSON.parse(value) : null;
};

const setStorage = (key: string, value: any) => {
    uni.setStorageSync(key, JSON.stringify(value));
};

// 定义类型接口
interface PasswordPopConfig {
    show: boolean
    title: string
    password: string
    confirm?: (data: string) => void
}


// console.log(hasNewMessage.value, 'hasNewMessage');

// 定义并导出 store
export const useMessageStore = defineStore('message', () => {

    const newMessageId = ref<number>(getStorage('newMessageId') || 0);
    const readyMessageId = ref<number>(getStorage('readyMessageId') || 0);
    const hasNewMessage = ref<boolean>(getStorage('hasNewMessage') || false);

    const passwordPopConfig = ref({
        show: false,
        title: '',
        password: '',
    } as PasswordPopConfig);

    const passwordPopShow = ref<boolean>(false);




    // 更新是否有新消息的状态
    const updateHasNewMessage = () => {
        if (newMessageId.value && readyMessageId.value && newMessageId.value === readyMessageId.value) {
            hasNewMessage.value = false;
        } else if (newMessageId.value > readyMessageId.value) {
            hasNewMessage.value = true;
        } else if (newMessageId.value === readyMessageId.value) {
            hasNewMessage.value = false;
        }
        setStorage('hasNewMessage', hasNewMessage.value);
    };

    // 修改密码弹窗配置
    const changePasswordPopConfig = (value: Partial<typeof passwordPopConfig.value>) => {
        passwordPopConfig.value = { ...passwordPopConfig.value, ...value };
    };

    // 修改密码弹窗显示状态
    const changePasswordPopShow = (value: boolean) => {
        passwordPopShow.value = value;
    };

    // 更新新消息 ID
    const updateNewMessageId = (value: number) => {
        newMessageId.value = value;
        updateHasNewMessage();
        setStorage('newMessageId', newMessageId.value);
    };

    // 更新已读消息 ID
    const updateReadyMessageId = (value: number) => {
        readyMessageId.value = value;
        updateHasNewMessage();
        setStorage('readyMessageId', readyMessageId.value);
    };

    // 返回状态和方法
    return {
        passwordPopConfig,
        passwordPopShow,
        newMessageId,
        readyMessageId,
        hasNewMessage,
        changePasswordPopConfig,
        changePasswordPopShow,
        updateNewMessageId,
        updateReadyMessageId,
        updateHasNewMessage,
    };
});
