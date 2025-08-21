<template>
	<view class="emptyComponent">
		<view class="top">
			<image src="@/static/empty.svg" mode=""></image>
		</view>
		<view class="bottom">
			暂无数据
		</view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		props: {
			title: {
				type: String,
				default: ''
			},
			backUrl: {
				type: String,
				default: ''
			},
			isTab: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {}
		},
		async created() {},
		methods: {
			gotoPage(url: string) {
				if(this.isTab) {
					uni.reLaunch({
					  url
					});
				} else {
					uni.navigateTo({
					  url 
					});
				}
			},
		}
	});
</script>

<style lang="scss" scoped>
	.emptyComponent {
		text-align: center;
		.top {
			image {
				width: 200rpx;
				height: 200rpx;
			}
		}
		.bottom {
			color: rgb(192 199 205);
		}
	}
</style>