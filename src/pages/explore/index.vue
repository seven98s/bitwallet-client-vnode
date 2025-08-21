<template>
	<view class='home-page' :style="{ paddingTop: statusBarHeight + 'px'}">
		<view class="navigationBar">
			<image src="@/static/newUI3/explore/logo.png" mode="aspectFill" class="logo" @click="param.show=true">
			</image>
			<view class="searchBox">
				<image src="@/static/newUI3/explore/searchIcon.png" mode="widthFix" class="searchIcon"></image>

				<input placeholder="搜索本地DApp或输入链接访问" v-model="param.url" @blur="confirm"
					placeholder-class='placeholderClass' class="inputClass" />

			</view>
			<image src="@/static/newUI3/explore/scanCode.png" mode="scaleToFill" class="scanCode" @click="scan"></image>
		</view>
		<!-- 轮播图 -->
		<swiper :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" class="carouselImageList" v-if='imageList.length>0'>
			<swiper-item v-for="(item,index) in imageList " :key="index" @click="toDapp(item.dappUrl)">
				<view class="carouselImageBox">
					<image :src="item.bannerImage" mode="widthFix" class="carouselImage"></image>
				</view>
			</swiper-item>
		</swiper>

		<!-- dapp列表 -->
		<view class="dappListBox" v-if='myDappList.length>0'>
			<view class="header">
				<view class="left">
					<view class="name">
						我的DAPP
					</view>
					<view class="line">

					</view>
				</view>
			</view>
			<view class="divider">
			</view>
			<view class="main">
				<view class="dappItem" v-for="(item, index) in myDappList" :key="item.name" @click="toDapp(item.url)">
					<image :src="item.icon" mode="scaleToFill" class="dappImage"></image>
					<view class="dappName">
						{{ item.name }}
					</view>
				</view>
			</view>
		</view>
		<view class="dappListBox">
			<view class="header">
				<view class="left">
					<view class="name">
						热门DAPP推荐
					</view>
					<view class="line">

					</view>
				</view>
				<!-- <view class="right">
					<view class="editBox">
						<image src="@/static/newUI3/explore/editIcon.png" mode="widthFix" class="editIcon"></image>
						<view class="editText">
							编辑
						</view>
					</view>
					<image src="@/static/newUI3/explore/addIcon.png" mode="widthFix" class="addIcon"></image>
				</view> -->
			</view>
			<view class="divider">
			</view>
			<view class="main">
				<view class="dappItem" v-for="(item, index) in show.recommendDapps" :key="index"
					@click="handleDapp(item)">
					<image :src="item.icon" mode="scaleToFill" class="dappImage"></image>
					<view class="dappName">
						{{ item.name }}
					</view>
				</view>
			</view>
		</view>

		<wallet-tabbar :currentIndex='2'></wallet-tabbar>
		<WalletPopup :show="param.show" url="./index" @walletPopupshow="walletPopupshow"></WalletPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import { CheckUtil } from '@/data/util/checkUtil';
	import { VersionData } from '@/data/version/versionData';
	import WalletPopup from "../../components/walletPopup.vue";
	import { UniUtil } from "@/data/util/uniUtil";
	export default Vue.extend({
		components: { WalletPopup },
		data() {
			return {
				param: {
					url: '',
					show: false,
				},
				show: {
					recommendDapps: new Array<any>(),
				},
				statusBarHeight: 0,
				imageList:new Array<any>(),
				myDappList: new Array<any>(),
					
				params:{
					pageNow:1,
					pageSize:10,
				}
			}
		},
		async onShow() {
			CheckUtil.checkInitWallet();
			this.param.url = "";

			// 加载热门推荐DAPP
			const recommendDapps : any = await VersionData.loadRecommendDapp();
			this.show.recommendDapps = recommendDapps;
		},
		onLoad() {
			uni.hideTabBar();
			this.getStoredData()
			this.getBannerList()
		},
		async created() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
		},
		methods: {
			confirm() {
				if (this.param.url != '') {
					this.toDapp(this.param.url);
				}
			},
			toDapp(url : string) {
				if(url.length>0) {
					uni.navigateTo({
						url: './dapp?url=' + url
					});
				}
				
			},
			walletPopupshow(show : boolean) {
				this.param.show = show
			},
			async scan() {
				await UniUtil.scanCollectCode().then((rs : any) => {
					uni.navigateTo({
						url: './dapp?url=' + rs
					});
				});
			},
			handleDapp(selectDapp : any) {
				console.log(selectDapp, 'item');
				// 查找目标对象的索引
				const index = this.myDappList.findIndex(item => item.name === selectDapp.name);

				// 如果对象存在，先删除该对象
				if (index !== -1) {
					this.myDappList.splice(index, 1);
				}

				// 在数组顶部追加对象
				this.myDappList.unshift(selectDapp);
				this.toDapp(selectDapp.url)
				this.saveDataToStorage()
			},
			saveDataToStorage() {
				uni.setStorageSync('myDappList', JSON.stringify(this.myDappList));
			},
			getStoredData() {
				const storedData = uni.getStorageSync('myDappList');
				this.myDappList = storedData ? JSON.parse(storedData) : [];
			},
			getBannerList() {
				this.$http({
					url:"/app/banner/getBannerList",
					method:'POST',
					data:this.params
				}).then((res:any)=>{
					// console.log(res,'res');
					this.imageList=res
				})
			}
		}
	});
</script>

<style lang="scss" scoped>
	.home-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		min-height: 100vh;
		padding-left: 31rpx;
		padding-right: 31rpx;
		padding-bottom: 180rpx;
		background-color: #f7f7f7;

		box-sizing: border-box;

		.navigationBar {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 59rpx;

			.logo {
				display: block;
				width: 43rpx;
				height: 59rpx;
			}

			.searchBox {
				display: flex;
				align-items: center;
				width: 567rpx;
				height: 60rpx;
				border-radius: 30rpx;
				border: 1px solid #1D1F20;
				padding-left: 33rpx;
				padding-right: 33rpx;
				box-sizing: border-box;


				.searchIcon {
					display: block;
					width: 31rpx;
					height: 31rpx;
					margin-right: 14rpx;
				}

				.inputClass {
					margin-top: 4rpx;
					flex: 1;
					height: 60rpx;
					font-size: 25rpx;

				}


				.placeholderClass {
					// font-family: PingFang;
					// font-weight: 500;
					font-size: 25rpx;
					color: #1D1F20;
				}

			}

			.scanCode {
				display: block;
				width: 35rpx;
				height: 32rpx;
			}
		}

		.carouselImageList {
			width: 100%;
			height: 253rpx;
			margin-top: 44rpx;
			// ps
			// background-color: pink;

			.carouselImageBox {
				width: 100%;
				height: 253rpx;
				border-radius: 25rpx;
				overflow: hidden;
				// background-color: pink;

				.carouselImage {
					display: block;
					width: 100%;
					height: 253rpx;
				}
			}
		}

		.dappListBox {
			width: 688rpx;
			min-height: 332rpx;
			margin-top: 37rpx;
			background: #FFFFFF;
			// ps
			// background-color: pink;
			border-radius: 25rpx;
			padding: 44rpx 38rpx 42rpx 40rpx;
			box-sizing: border-box;

			.header {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 50rpx;

				.left {
					width: max-content;
					height: 50rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;


					.name {
						width: max-content;
						// width: 145rpx;
						height: 33rpx;
						font-family: PingFang;
						font-weight: bold;
						font-size: 32rpx;
						color: #1D1F20;
					}

					.line {
						width: 100%;
						height: 8rpx;
						background: #9D120F;
						border-radius: 4rpx;
					}
				}

				.right {
					display: flex;
					align-items: center;
					height: 38rpx;

					.editBox {
						display: flex;
						align-items: center;
						width: 106rpx;
						height: 38rpx;
						border-radius: 19rpx;
						border: 1px solid #1D1F20;
						padding-left: 17rpx;
						margin-right: 12rpx;
						box-sizing: border-box;

						.editIcon {
							display: block;
							width: 19rpx;
							height: 22rpx;
							margin-right: 10rpx;
						}

						.editText {
							// width: 29rpx;
							height: 14rpx;
							line-height: 14rpx;
							font-family: PingFang;
							font-weight: 500;
							font-size: 14rpx;
							color: #1D1F20;
						}
					}

					.addIcon {
						width: 38rpx;
						height: 38rpx;

					}
				}
			}

			.divider {
				width: 100%;
				height: 1rpx;
				background-color: black;
			}

			.main {
				display: flex;
				flex-wrap: wrap;
				width: 100%;
				min-height: 157rpx;
				// background-color: skyblue;
				margin-top: 38rpx;

				.dappItem {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width: 98rpx;
					height: 134rpx;
					// background-color: pink;
					margin-right: 30rpx;
					margin-bottom: 20rpx;

					.dappImage {
						display: block;
						width: 99rpx;
						height: 99rpx;
					}

					.dappName {
						width: 100%;
						height: 18rpx;
						text-align: center;
						line-height: 18rpx;
						font-family: PingFang;
						font-weight: 500;
						font-size: 18rpx;
						color: #1D1F20;
					}
				}
				.dappItem:nth-child(5n) {
					margin-right: 0rpx;
				}

			}
		}
	}
</style>