<template>
	<view class="navigationBar">
		<view class="nodeBox">
			<image src="@/static/newUI3/index/nodeIcon2.png" mode="scaleToFill" class="nodeIcon" @click="gotoPage('/pages/my/setNode')"></image>

			<view class="nodeText">
				急速
			</view>
		</view>
		<view class="searchBox">
			<image src="@/static/newUI3/node/searchIcon.png" mode="scaleToFill" class="searchIcon"></image>
			<input :placeholder="searchKeyWord" placeholder-class="searchText" @blur="confirm" v-model='url' disabled />
		</view>
		<view class="methodsBox">
			<image src="@/static/newUI3/node/customerService.png" mode="heightFix" class="methodsIcon" @click="gotoPage('/pages/my/about')"></image>
			<image src="@/static/newUI3/node/scanCode.png" mode="heightFix" class="methodsIcon" @click="scan"></image>
			<view class="notice" @click="gotoPage('/pages/node/operate/messageCenter')">
				<image src="@/static/newUI3/index/newsTips.png" class="newsTips" v-if="this.$store.state.hasNewMessage"></image>
			</view>
			<!-- <image src="@/static/newUI3/node/notice.png" mode="heightFix" class="methodsIcon" @click="showToast('消息提示功能')"></image> -->
		</view>
	</view>
</template>

<script >
	import { UniUtil } from "@/data/util/uniUtil";
	export default {
		name: "navigationBar",
		props: {
			searchKeyWord: {
				type: String,
				required: false,
				default: '',

			}
		},
		data() {
			return {
				url: "",
			}

		},
		created() {
		},
		methods: {
			confirm() {
				if (this.url.length > 0) {
					uni.navigateTo({
						url: '/pages/explore/dapp?url=' + this.url
					});
				}

			},
			gotoPage(pageUrl) {
				uni.navigateTo({
					url:pageUrl
				});
			},
			async scan() {
				await UniUtil.scanCollectCode().then((rs) => {
					uni.navigateTo({
						url: '/pages/wallet/transfer/transfer?address=' + rs
					});
				});
			},
			showToast(tips) {
				  uni.showToast({
				                title: `${tips}功能待定`, // 提示的内容
				                icon: 'none', // 图标，有效值 'success'、'loading'、'none'
				                duration: 2000, // 提示的延迟时间，单位毫秒，默认 1500
				                mask: false // 是否显示透明蒙层，防止触摸穿透，默认 false
				            });
			},
		}
	}
</script>

<style lang="scss">
	.navigationBar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 59rpx;
		// background-color: pink;

		.nodeBox {
			display: flex;
			align-items: center;
			width: 146rpx;
			height: 58rpx;
			// background: #f7aaa9;
			background-color: #FFFFFF;
			border-radius: 29rpx;
			border: 1rpx solid #1D1F20;
			box-sizing: border-box;

			.nodeIcon {
				display: block;
				width: 56rpx;
				height: 56rpx;
				margin-right: 15rpx;
			}


			.nodeText {
				height: 23rpx;
				font-family: PingFang;
				font-weight: 500;
				font-size: 23rpx;
				line-height: 23rpx;
				color: #0E932E;
			}
		}

		.searchBox {
			display: flex;
			align-items: center;
			width: 343rpx;
			height: 58rpx;
			border-radius: 30rpx;
			border: 1rpx solid #1D1F20;
			box-sizing: border-box;
			padding-left: 21rpx;
			padding-right: 21rpx;
			.searchIcon {
				display: block;
				width: 31rpx;
				height: 31rpx;
				margin-right: 14rpx;
			}

			input {
				flex: 1;
				height: 31rpx;
				color: #1D1F20;
				font-size: 23rpx;
			}

			.searchText {

				font-family: PingFang;
				font-weight: 500;
				font-size: 23rpx;
				line-height: 23rpx;
				color: #1D1F20;
			}
		}

		.methodsBox {
			display: flex;
			justify-content: space-between;
			width: 160rpx;
			height: 39rpx;

			// background-color: skyblue;
			.methodsIcon {
				display: block;
				height: 39rpx;
			}
			.notice {
				position: relative;
				width: 34rpx;
				height: 39rpx;
				background-image: url('@/static/newUI3/node/notice.png');
				background-size: 100% 100%;
				.newsTips {
					position: absolute;
					top: 0;
					right: -6rpx;
					display: block;
					width: 20rpx;
					height: 20rpx;
				}
			}
		}
	}
</style>