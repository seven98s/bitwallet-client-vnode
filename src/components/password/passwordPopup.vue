<template>
	<view class="passwordPopup" v-show="messageStore.passwordPopConfig.show">
		<view class="popup" @click="close"></view>
		<view class="popupContainer">
			<view class="passwordBox">
				<view class="header">
					{{ messageStore.passwordPopConfig.title !== '' ? messageStore.passwordPopConfig.title : '签名交易' }}
				</view>
				<view class="divider">

				</view>
				<view class="paramsList">
					<view class="paramsItem">
						<view class="paramsTitle">
							钱包密码
						</view>
						<view class="paramsInputBox">
							<input type="password" placeholder="请输入钱包密码" v-model="param.password"
								placeholder-class="textareaFont" />
						</view>
					</view>
				</view>
				<view class="buttonList">
					<view class="button" @click="close">
						取消
					</view>
					<view class="button activeButton" @click="confirm(param.password)">
						确认
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">

import { useMessageStore } from '@/store/modules/Message'
import { UniUtil } from '@/data/util/uniUtil';
import { onLoad } from '@dcloudio/uni-app';
const messageStore = useMessageStore()


const param = ref({
  initFlag: false,
  password: '',
})


onLoad(() => {
  param.value.password = ''
  messageStore.changePasswordPopConfig({ show: false })
})


const close = () => {
  param.value.password = ''
  messageStore.changePasswordPopConfig({ show: false })
  UniUtil.loadHide()
}

const confirm = async (password: string) => {

  param.value.password = ''
  if (typeof messageStore.passwordPopConfig.confirm === 'function') {
    await messageStore.passwordPopConfig.confirm(password)
  }
}
</script>

<style lang="scss" scoped>
	.passwordPopup {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 999;
		.popup {
			position: absolute;
			width: 100vw;
			height: 100vh;
			z-index: 1000;
			background-color: rgba(0, 0, 0, 0.5);
		}
		.popupContainer {
			z-index: 1001;
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 600rpx;
			height: 804rpx;
			padding-top: 255rpx;
			box-sizing: border-box;
			background-image: url('@/static/newUI3/transaction/passwordContainer.png');
			background-size: 100% 100%;

			.passwordBox {
				width: 100%;
				height: 100%;
				// background-color: pink;
				padding: 30rpx 20rpx;
				box-sizing: border-box;

				.header {
					width: 100%;
					height: 40rpx;

					text-align: center;
					line-height: 40rpx;
					font-size: 40rpx;
					font-family: PingFang;
					font-weight: 700;
				}

				.divider {
					width: 100%;
					height: 1rpx;
					background-color: #ccc;
					margin-top: 50rpx;
				}

				.paramsList {
					margin-top: 60rpx;
					width: 100%;
					height: 140rpx;
					// background-color: skyblue;

					.paramsItem {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						width: 100%;
						height: 140rpx;

						.paramsTitle {
							width: 100%;
							height: 30rpx;
							color: #a8aab5;
							font-size: 22rpx;
							line-height: 30rpx;
							padding-left: 39rpx;
							box-sizing: border-box;
						}

						.paramsInputBox {
							width: 100%;
							height: 80rpx;
							background-color: #f7f7f7;
							border-radius: 40rpx;

							input {
								width: 100%;
								height: 80rpx;
								font-family: PingFang;
								font-weight: 500;
								font-size: 28rpx;
								padding: 0rpx 36rpx;
								box-sizing: border-box;
							}
						}
					}
				}

				.buttonList {
					margin-top: 60rpx;
					display: flex;
					justify-content: space-between;
					width: 100%;
					height: 80rpx;

					.button {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 260rpx;
						height: 80rpx;
						background-color: #838383;
						border-radius: 40rpx;
						font-size: 28rpx;
						color: #fff;
						font-family: PingFang;
					}

					.activeButton {
						background-color: #1d1f20 !important;
					}
				}
			}
		}
	}

	.textareaFont {
		font-family: PingFang;
		font-weight: 500;
		font-size: 24rpx;
		color: black;
		line-height: 24rpx;


	}
</style>