<template>
	<view class="home-page">
		<view class="fixedBox" :style="{ paddingTop: statusBarHeight + 'px'}">
			<titleBar title='BIT速递'></titleBar>
		</view>
		<view class="articleBox" :style="{ marginTop: fixedBoxHeight+10 + 'px'}">
			<view class="articleTitle">
				{{messageInfo.title}}
			</view>
			<view class="articleIntroduction">
				<view class="articleAuthor">
					{{messageInfo.publisher}}
				</view>
				<view class="releaseTime">
					{{messageInfo.createTime}}
				</view>
			</view>
			<view class="underLine">
			</view>
			<view class="articleDetail" v-html="messageInfo.deatil">
			</view>
		</view>

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
				messageId: 0,
				messageInfo:{} as any
			}
		},
		async onLoad(options : any) {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			this.messageId = options.messageId
				
			if(this.$store.state.newMessageId<=this.messageId) {
				this.$store.commit('updateReadyMessageId',Number(this.messageId));
			}
			this.getMessageDetail()
		},
		methods: {
			getMessageDetail(){
				this.$http({
					url: `/app/announcement/getById/${this.messageId}`,
					method: 'GET',
				}).then((res : any) => {
					// console.log(res,'res');
					this.messageInfo=res
					
				})
			}
		},
		mounted() {

			const query = uni.createSelectorQuery().in(this);
			// 选择目标组件
			query.select('.fixedBox')
				.boundingClientRect((data : any) => {
					if (data) {
						// 获取组件的高度
						this.fixedBoxHeight = data.height;
					}
				})
				.exec();


		}

	});
</script>


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

		.fixedBox {
			position: fixed;
			z-index: 999;
			width: 100vw;
			padding: 0rpx 31rpx;
			box-sizing: border-box;
			background-color: #fff;
		}

		.articleBox {
			width: 100%;

			.articleTitle {
				margin-top: 40rpx;
				width: 100%;
				height: 40rpx;
				color: #060606;
				font-weight: 700;
				font-size: 40rpx;
				line-height: 40rpx;
				text-align: center;
			}

			.articleIntroduction {
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 24rpx;
				color: #A2A4B0;

				.articleAuthor {
					margin-right: 20rpx;
					height: 24rpx;
					font-size: 24rpx;
					font-family: PingFang;
					line-height: 24rpx;
				}

				.releaseTime {
					height: 24rpx;
					font-size: 24rpx;
					font-family: PingFang;
					line-height: 24rpx;
				}
			}

			.underLine {
				margin-top: 20rpx;
				width: 100%;
				height: 2rpx;
				background-color: #EBEBEB;
			}

			.articleDetail {
				margin-top: 20rpx;
				width: 100%;
				color: #A2A4B0;
				font-size: 24rpx;
				font-family: PingFang;
				line-height: 30rpx;

			}
		}

	}
</style>