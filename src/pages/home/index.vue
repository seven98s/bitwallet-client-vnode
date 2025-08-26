<template>
	<view class="page">
		<NoWallet v-if="param.show"></NoWallet>
		<HasWallet v-else :refresh="param.refresh"></HasWallet>
		<VersionPopup :show="param.versionShow" @versionPopupshow="versionPopupshow" :refresh="param.refresh">
		</VersionPopup>
	</view>
</template>

<script setup lang="ts">
import Vue from 'vue';
import NoWallet from './noWallet.vue';
import HasWallet from './hasWallet.vue';
import VersionPopup from '@/components/versionPopup.vue';
import { WalletData } from '@/data/wallet/walletData';
import { VersionData } from '@/data/version/versionData';
import { onLoad, onShow, onHide } from '@dcloudio/uni-app';
import { useMessageStore } from '@/store/modules/Message';
const MessageStore = useMessageStore();

import { useHttp } from '@/composables/useHttp'

const http = useHttp()

const param = ref({
	refresh: 0,
	show: true,
	versionShow: false,
});

const params = ref({
	pageNo: 1,
	pageSize: 10
});

onLoad(() => {
	uni.hideTabBar();
})

onShow(async () => {
	const account = WalletData.account;
	param.value.show = (account.address === undefined);
	
	param.value.refresh += 1;

	const systemInfo = uni.getSystemInfoSync();
	if (systemInfo.platform == "ios" || systemInfo.platform == "android") {
		await loadVersion();
	}
	getMessageList();
})

onHide(() => {
	param.value.refresh = -1;
})

const loadVersion = async () => {
	try {
		const rs = await VersionData.load()
		const systemInfo = uni.getSystemInfoSync();
		const appVersion = systemInfo.appVersionCode as string;

		const { version, versionCode } = rs as { version:string; versionCode:string};
		
		// 比较版本号，需要更新时显示弹窗
		if (parseInt(appVersion) < parseInt(versionCode)) {
			// 查询是否为忽略版本才显示更新弹窗
			if (VersionData.ignoreVersion !== version) {
				param.value.versionShow = true;
				uni.hideTabBar();
			}
		}
	} catch(error) {
		console.error('版本检查失败:', error);
	}
}

// 控制版本弹窗显示
const versionPopupshow = (show: boolean) => {
	param.value.versionShow = show;
}

// 获取消息列表
const getMessageList = async () => {
try {
	const res = await http({
		url: "/app/announcement/page",
		method: 'POST',
		data: params
	})
	if (res.list.length > 0) {
		MessageStore.updateNewMessageId(res.list[0].id);
	}
} catch(error) {
	console.error('获取消息列表失败:', error);
}
}

</script>




<style lang="scss" scoped></style>