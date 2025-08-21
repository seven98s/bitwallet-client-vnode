<template>
	<view class="page">
		<web-view :src="url"></web-view>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import { toChainScanUrl } from "@/config";
export default Vue.extend({
	data() {
		return {
			url: "",
		}
	},
	onLoad(query: any) {
		// this.url = "http://47.236.254.203:6002/#/transaction/"+query.txHash;
		// this.url = "http://bitscan.bitnetworkbc.com/#/transaction/"+query.txHash;
		this.url=toChainScanUrl+query.txHash
	},
	methods: {}
});
</script>

<style lang="scss" scoped>
	.page {
	}
</style>
