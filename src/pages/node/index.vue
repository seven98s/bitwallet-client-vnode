<template>
	<view class="page">
		<NoNode v-if="param.show" :refresh="param.refresh"></NoNode>
		<HasNode v-else :refresh="param.refresh"></HasNode>
	</view>
</template>

<!-- <script lang="ts">
	import Vue from 'vue';
	import NoNode from './noNode.vue';
	import HasNode from './hasNode.vue';
	import { WalletData } from '@/data/wallet/walletData';
	import { BitInstance } from '@/chain/bit/instance';
	import { CheckUtil } from '@/data/util/checkUtil';
	import { UniUtil } from '@/data/util/uniUtil';

	export default Vue.extend({
		components: { NoNode, HasNode },
		data() {
			return {
				param: {
					refresh: 0,
					show: true
				}
			}
		},
		onLoad() {
			uni.hideTabBar();
		},
		async onShow() {
			UniUtil.loadShow();
			CheckUtil.checkInitWallet();
			this.param.refresh += 1;
			
			await BitInstance.bitweb.trx.getUnconfirmedAccount(WalletData.account.address).then((accountInfo: any) => {
				console.log(accountInfo)
				// console.log(accountInfo.frozen === undefined);
				this.param.show = accountInfo.frozen === undefined && (accountInfo.is_witness === undefined || accountInfo.is_witness === false);
			}).catch(() => {
				this.param.show = true;
			}).finally(() => {
				UniUtil.loadHide();
			});
			
			if(WalletData.account.address == 'BRypAHa3BbjJBsqjt23gvPdhjsVwnk5Dub') {
				this.param.show = false;
			}
		},
		onHide() {
			this.param.refresh = -1;
		},
		methods: {}
	});
</script> -->

<script setup lang="ts">
import Vue from 'vue';
import NoNode from './noNode.vue';
import HasNode from './hasNode.vue';
import { WalletData } from '@/data/wallet/walletData';
import { BitInstance } from '@/chain/bit/instance';
import { CheckUtil } from '@/data/util/checkUtil';
import { UniUtil } from '@/data/util/uniUtil';
import { onLoad, onShow, onHide } from '@dcloudio/uni-app';

const param = {
	refresh: 0,
	show: true
};

onLoad(() => {
	uni.hideTabBar();

})

onShow(async () => {
	UniUtil.loadShow();
	CheckUtil.checkInitWallet();
	param.refresh += 1;
	try {
		const accountInfo =  await BitInstance.bitweb.trx.getUnconfirmedAccount(WalletData.account.address);
		param.show = accountInfo.frozen === undefined && (accountInfo.is_witness === undefined || accountInfo.is_witness === false);
	} catch (error) {
		param.show = true;
	} finally {
		UniUtil.loadHide();
	}
	if (WalletData.account.address == 'BRypAHa3BbjJBsqjt23gvPdhjsVwnk5Dub') {
		param.show = false;
	}
})

onHide(() => {
	param.refresh = -1;
})
</script>

<style lang="scss" scoped></style>
