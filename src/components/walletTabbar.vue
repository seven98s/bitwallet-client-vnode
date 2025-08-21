<template>
	<view class="bottomBox">
		<view class="divider"></view>
		<view class="tabbarList">
			<view class="tabbarItem" v-for="(item,index) in list" @click="tabbarSwitch(index,item.pagePath)"
				:key="index">
				<image :src="currentIndex==index? item.selectedIconPath:item.iconPath" mode="widthFix"
					class="tabbarIcon"></image>
				<view class="tabbText" :class="currentIndex==index?'activedText':''">
					{{item.text}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "tabbar",
		props: {
			currentIndex: {
				type: Number,
				default: 0
			},

		},
		data() {
			return {
				"list": [{
						"text": "首页",
						"pagePath": "/pages/home/index",
						"iconPath": require('@/static/newUI3/tabbar/home.png'),
						"selectedIconPath": require('@/static/newUI3/tabbar/homeActive.png')

					},
					{
						"text": "节点",
						"pagePath": "/pages/node/index",
						"iconPath": require('@/static/newUI3/tabbar/node.png'),
						"selectedIconPath": require('@/static/newUI3/tabbar/nodeActive.png')
					},
					{
						"text": "探索",
						"pagePath": "/pages/explore/index",
						"iconPath": require('@/static/newUI3/tabbar/explore.png'),
						"selectedIconPath": require('@/static/newUI3/tabbar/exploreActive.png')
					},
					{
						"text": "我的",
						"pagePath": "/pages/my/index",
						"iconPath": require('@/static/newUI3/tabbar/my.png'),
						"selectedIconPath": require('@/static/newUI3/tabbar/myActive.png')
					}
				]
			};
		},
		methods: {
			tabbarSwitch(index, pagePath) {
				uni.switchTab({
					url: pagePath
				})
			}
		}
	}
</script>

<style lang="scss">
	.bottomBox {

		position: fixed;
		left: 0;
		bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: content-box !important;
		background-color: #fff;

	}

	.divider {
		width: 750rpx;
		height: 6rpx;
		background: linear-gradient(0deg, #DDDDDD 0%, rgba(247, 247, 247, 0) 100%);
	}

	.tabbarList {
		display: flex;
		align-items: center;
		width: 750rpx;
		height: 148rpx;

		.tabbarItem {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			flex: 1;
			height: 75rpx;


			.tabbarIcon {
				display: block;
				width: 41rpx;
				height: 41rpx;
				// height: 90rpx;
			}

			.tabbText {
				display: flex;
				align-items: center;
				justify-content: center;

				height: 20rpx;
				font-family: PingFang;
				font-weight: bold;
				font-size: 20rpx;
				color: #A2A4B0;
			}

			.activedText {
				color: #1D1F20 !important;
			}
		}
	}
</style>