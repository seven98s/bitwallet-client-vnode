<template>
	<view class='titleBar'>
		<image src="@/static/newUI3/index/leftArrow.png" mode="aspectFill" class="leftArrow" @click="goBack"></image>
		<view class="title">
			{{title}}
		</view>
		<image v-if="isShowScanCode" src="@/static/newUI3/index/scanCode2.png" mode="aspectFill" class="scanCode"
			@click="scanCode"></image>
	</view>
</template>

<script>
	import {
		UniUtil
	} from "@/data/util/uniUtil";
	export default {
		name: "titleBar",
		props: {
			title: {
				type: String,
				required: false,
				default: '',
			},
			isShowScanCode: {
				type: Boolean,
				required: false,
				default: false,
			}
		},
		data() {
			return {

			};
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			scanCode() {
				// #ifdef APP-PLUS
				uni.scanCode({
					onlyFromCamera: false,
					success: (res) => {
						this.$emit('scanSuccess', res.result);
					},
					fail: (err) => {
						// uni.showToast({
						// 	title: `扫码失败：${err.errMsg}`,
						// 	icon: 'none',
						// 	duration: 2000
						// });
					}
				});
				// #endif
				// #ifdef H5
				this.$emit('scanSuccess', '测试数据123456');
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	.titleBar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 39rpx;
	}

	.title {
		height: 32rpx;
		font-family: PingFang;
		// font-weight: bold;
		font-weight: 700;
		font-size: 32rpx;
		line-height:39rpx;
		color: #000000;
	}

	.leftArrow {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		width: 46rpx;
		height: 39rpx;
	}

	.scanCode {
		position: absolute;
		top: 0;
		right: 0;
		display: block;
		width: 43rpx;
		height: 39rpx;
	}
</style>