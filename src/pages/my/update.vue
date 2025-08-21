<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='修改密码' ></titleBar>
		<view class="paramsList">
		<view class="paramsItem" >
			<view class="paramsTitle">
				旧密码
			</view>
			<view class="paramsInputBox">
				<input type="password" placeholder="请输入旧密码" v-model="param.update.oldPassword"
					placeholder-class="textareaFont" />
			</view>
		</view>
			<view class="paramsItem" >
				<view class="paramsTitle">
					新密码
				</view>
				<view class="paramsInputBox">
					<input type="password" placeholder="请输入密码,至少8位数"v-model="param.update.password"
						placeholder-class="textareaFont" />
				</view>
				<view class="paramsInputBox">
					<input type="password" placeholder="请再次输入密码" v-model="param.update.rePassword"
						placeholder-class="textareaFont" />
				</view>
			</view>
	
			
		</view>
		</TermAndPrivacy>
		<view class="confirmButton" @click="confirm">
			确认
		</view>
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import { BitInstance } from '@/chain/bit/instance';
import { CheckUtil } from '../../data/util/checkUtil';
import { WalletData } from '../../data/wallet/walletData';
import { UniUtil } from '../../data/util/uniUtil';

export default Vue.extend({
	data() {
		return {
			param: {
				update: {
					oldPassword: '',
					password: '',
					rePassword: '',
				},
			},
			statusBarHeight:0,
		}
	},
	onLoad() {
		const systemInfo = uni.getSystemInfoSync();
		this.statusBarHeight = systemInfo.statusBarHeight! + 15;
	},
	methods: {
		confirm() {
			const { oldPassword, password, rePassword } = this.param.update;
			if(CheckUtil.isStrEmptyAndMessage(oldPassword, "请输入旧密码")) return;
			if(CheckUtil.isStrEmptyAndMessage(password, "请输入新密码")) return;
			if(!CheckUtil.lengthRangeEqAndMessage(password, "密码至少需要8位数", 8)) return;
			if(CheckUtil.isStrEmptyAndMessage(rePassword, "请输入重复密码")) return;
			if(!CheckUtil.isStrSameAndMessage(password, rePassword, "密码不一致")) return;
			if(WalletData.checkUserPassword(oldPassword)) {
				UniUtil.toastError("密码错误");
				return;
			}
			
			const user = WalletData.user;
			user.password = password;
			WalletData.saveOrUpdUser(user);
			UniUtil.toastSuccess("密码修改成功", () => {
				setTimeout(() => {
					uni.switchTab({
						url: './index'
					});
				}, 200);
			});
		}
	}
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
		padding: 0rpx 31rpx;
		box-sizing: border-box;
		background-color: #fff;
		background-size: 100% 100%;
		box-sizing: border-box;
	
		.paramsList {
			width: 100%;
			margin-top: 44rpx;
			// background-color: pink;
	
			.paramsItem {
				width: 100%;
				min-height: 90rpx;
				margin-bottom: 30rpx;
				// background-color: skyblue;
	
				.paramsTitle {
					width: 100%;
					height: 28rpx;
					line-height: 28rpx;
					font-family: PingFang;
					font-weight: 800;
					font-size: 28rpx;
					color: #000000;
					margin-bottom: 10rpx;
				}
	
				.paramsInputBox {
					width: 100%;
					height: 51rpx;
					// background-color: greenyellow;
					border-bottom: 1rpx dashed #A2A4B0;
	
					input {
						width: 100%;
						height: 50rpx;
						font-size: 28rpx;
						line-height: 28rpx;
					}
				}
			}
		}
		.confirmButton {
			margin-top: 200rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 617rpx;
			height: 79rpx;
			background: #1D1F20;
			border-radius: 39rpx;
			font-family: PingFang;
			font-weight: 800;
			font-size: 28rpx;
			color: #FFFFFF;
		}
	}
	
	.textareaFont {
		font-family: PingFang;
		font-weight: 500;
		font-size: 28rpx;
		color: #A2A4B0;
		line-height: 28rpx;
	}
</style>