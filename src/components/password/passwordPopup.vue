<template>
	<view class="passwordPopup" v-show="messageStore.passwordPopConfig.show">
		<view class="popup" @click="close"></view>
		<view class="popupContainer">
			<view class="passwordBox">
				<view class="header">
					{{ messageStore.passwordPopConfig.title !== '' ? messageStore.passwordPopConfig.title : '签名交易' }}
				</view>
				<view class="divider">

				</view>
				<view class="paramsList">
					<view class="paramsItem">
						<view class="paramsTitle">
							钱包密码
						</view>
						<view class="paramsInputBox">
							<input type="password" placeholder="请输入钱包密码" v-model="param.password"
								placeholder-class="textareaFont" />
						</view>
					</view>
				</view>
				<view class="buttonList">
					<view class="button" @click="close">
						取消
					</view>
					<view class="button activeButton" @click="confirm(param.password)">
						确认
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">

import { useMessageStore } from '@/store/modules/Message'
import { UniUtil } from '@/data/util/uniUtil';
import { onLoad } from '@dcloudio/uni-app';
const messageStore = useMessageStore()


const param = ref({
  initFlag: false,
  password: '',
})


onLoad(() => {
  param.value.password = ''
  messageStore.changePasswordPopConfig({ show: false })
})


const close = () => {
  param.value.password = ''
  messageStore.changePasswordPopConfig({ show: false })
  UniUtil.loadHide()
}

const confirm = async (password: string) => {
//   param.value.password = ''
//   if (typeof messageStore.passwordPopConfig.confirm === 'function') {
//     await messageStore.passwordPopConfig.confirm(password)
//   }
}
</script>

<style scoped>
.popup {
	padding: 20px;
	min-width: 300px;
}

.title {
	display: block;
	margin-bottom: 12px;
}

.input {
	border: 1px solid #ccc;
	border-radius: 4px;
	padding: 6px;
	width: 100%;
}

.actions {
	display: flex;
	justify-content: space-between;
	margin-top: 16px;
}
</style>