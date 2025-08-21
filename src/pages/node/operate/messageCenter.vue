<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='消息中心'></titleBar>
		<view class="messageTypeList">
			<view class="messageTypeItem" v-for="(item,index) in messageTypeList" :key='index'
				@click="changeMessageType(item.type)">
				<view class="text" :class="selectMessageType==item.type?'activeText':''">
					{{item.text}}
				</view>
				<view class="underLine" :class="selectMessageType==item.type?'activeUnderLine':''">

				</view>
			</view>
		</view>
		<view class="underLine">
		</view>
		<scroll-view scroll-y="true" class="messageList" @scrolltolower='onScrollToLower'>
			<view class="messageItem" v-for="(item,index) in  messageList" :key="index"
				@click="gotoMessageDetail(item.id)">
				<view class="left">
					<view class="messageTitle">
						{{item.title}}
					</view>
					<view class="messageIntroduction">
						{{item.synopsis}}
					</view>
					<view class="messageTime">
						{{item.createTime}}
					</view>
				</view>
				<view class="right">
					<image src="@/static/newUI3/index/rightArrow.png" mode="aspectFill" class="moreIcon"></image>
				</view>
			</view>
		</scroll-view>

	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	export default Vue.extend({
		data() {
			return {
				statusBarHeight: 0,
				messageTypeList: [] as any,
				selectMessageType: 0,
				fixedBoxHeight: 0,
				params: {
					pageNo: 1,
					pageSize: 10
				},
				messageList: new Array<any>(),
				total: 0,

			}
		},
		async onLoad() {
			this.messageTypeList = [
				{
					text: "全部",
					type: 0,
				},
			]
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;

			await this.getMessageList()
		},
		methods: {
			changeMessageType(type : number) {
				this.selectMessageType = type
			},
			async getMessageList() {
				this.$http({
					url: "/app/announcement/page",
					method: 'POST',
					data: this.params
				}).then((res : any) => {
					if (res.list.length > 0) {
						this.messageList.push(...res.list)
						this.total = res.total
						// if(this.params.pageNo==1) {
						// 	this.$store.commit('updateNewMessageId',this.messageList[0].id);
						// }
					}
				})
			},

			onScrollToLower() {
				if (this.messageList.length >= this.total) {
					this.showTips()
					return
				}
				this.params.pageNo++
				this.getMessageList()
			},
			showTips() {
				uni.showToast({
					title: '没有更多数据',
					icon: 'none',
					duration: 2000,
					mask: false
				});
			},
			gotoMessageDetail(id : number) {
				// console.log(id,'id');
				uni.navigateTo({
					url: '/pages/node/operate/messageDetail?messageId=' + id
				})
			}
		},
	});
</script>

<style>

</style>
<style lang="scss" scoped>
	.home-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		height: 100vh;
		padding: 0rpx 31rpx 20rpx 31rpx;
		box-sizing: border-box;
		background-color: #fff;
		background-size: 100% 100%;
		box-sizing: border-box;

		.messageTypeList {
			margin-top: 40rpx;
			display: flex;
			width: 100%;
			height: 50rpx;


			.messageTypeItem {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 50rpx;
				margin-right: 20rpx;

				.text {
					width: max-content;
					height: 28rpx;
					color: #A2A4B0;
					font-family: PingFang;
					font-size: 28rpx;
					line-height: 28rpx;
					text-align: center;
				}

				.underLine {
					width: 100%;
					height: 8rpx;
					background-color: #fff;
					border-radius: 4rpx;
				}

				.activeText {
					color: #060606 !important;
					font-size: 32rpx !important;
					font-weight: bold;
					line-height: 32rpx !important;
				}

				.activeUnderLine {
					background-color: #E80502 !important;
				}


			}

			& .messageTypeItem:last-child {
				margin-right: 0rpx;
			}
		}

		.underLine {
			width: 100%;
			height: 2rpx;
			background-color: #EBEBEB;
		}

		.messageList {
			margin-top: 20rpx;
			width: 100%;
			flex: 1;
			overflow-y: auto;


			.messageItem {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 156rpx;
				padding: 20rpx;
				box-sizing: border-box;
				border-radius: 25rpx;
				background-color: #f9f9f9;
				margin-bottom: 20rpx;

				.left {
					width: 550rpx;
					height: 100%;

					.messageTitle {
						width: 100%;
						height: 28rpx;
						color: #060606;
						font-weight: bold;
						line-height: 28rpx;
						font-family: PingFang;
						font-size: 28rpx;

						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					.messageIntroduction {
						margin-top: 20rpx;
						width: 100%;
						height: 24rpx;
						color: #A2A4B0;
						font-family: PingFang;
						font-size: 24rpx;
						line-height: 24rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						// ps
						// background-color: skyblue;
					}

					.messageTime {
						margin-top: 20rpx;
						width: 100%;
						height: 24rpx;
						color: #A2A4B0;
						font-size: 24rpx;
						font-family: PingFang;
						line-height: 24rpx;
						// ps
						// background-color: skyblue;
					}
				}

				.right {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 18rpx;
					height: 100%;
					// ps
					// background-color: skyblue;

					.moreIcon {
						display: block;
						width: 18rpx;
						height: 31rpx;
					}
				}


			}
		}

	}
</style>