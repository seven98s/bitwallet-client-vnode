<!-- 质押操作页面 -->
<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
		<titleBar title='质押'></titleBar>
		<image src="@/static/newUI3/node/pledge.png" mode="aspectFill" class="pledgeBox"></image>
		<view class="title">
			质押金额（BIT）
		</view>
		<view class="inputBox">
			<input type="text" placeholder="请输入质押数量" v-model.number="param.pledgeNum" placeholder-class="textareaFont">
		</view>
		<view class="walletBalance">
			钱包余额:{{ show.amount }} BIT
		</view>
		<view class="walletBalance">
			网络费:0.00266 BIT
		</view>
		<view class="confirmButton" @click="confirm">
			确认
		</view>
		<PasswordPopup></PasswordPopup>
	</view>
</template>


<script setup lang="ts">

import TermAndPrivacy from "@/components/termAndPrivacy.vue";
import PasswordPopup from "@/components/password/passwordPopup.vue";
import { BitInstance } from '@/chain/bit/instance';
import { BitAccount } from '@/chain/bit/account/account';
import { CheckUtil } from '@/data/util/checkUtil';
import { UniUtil } from '@/data/util/uniUtil';
import { WalletData } from '@/data/wallet/walletData';
import { onLoad, onShow } from "@dcloudio/uni-app";

const show = reactive({
	amount: ''
})

const param = reactive({
	pledgeNum: ''
})

const statusBarHeight = ref(0)


onLoad(() => {
	const systemInfo = uni.getSystemInfoSync()
	statusBarHeight.value = (systemInfo.statusBarHeight || 0) + 15
})

onShow(async () => {
	try {
		const rs = await BitAccount.getAssets(WalletData.account.address, [], true, 1, 100) as any
		const datas = rs.data
		datas.forEach((data: any) => {
			if (data.tokenType === 'BIT') {
				show.amount = data.balance
			}
		})
	} catch (e) {
		UniUtil.toastError('加载失败，请刷新重试')
	}
})


async function confirm() {
	UniUtil.loadShow()
	const { pledgeNum } = param;

	// check
	if (CheckUtil.isStrEmptyAndMessage(pledgeNum, '请输入质押数量')) return
	if (!CheckUtil.isStrNumberAndMessage(pledgeNum, '请输入数字')) return

	const pledgeAmount = BitInstance.bitweb.toBit(Number(pledgeNum)).toString()
	const chainAccount = await BitInstance.bitweb.trx.getAccount(WalletData.account.address)

	if (chainAccount.address === undefined || BigInt(chainAccount.balance) <= BigInt(pledgeAmount)) {
		UniUtil.toastError('余额不足')
		return
	}

	try {
		const rs = await BitInstance.bitweb.trx.freezeBalance(pledgeAmount.toString())
		if (rs.result) {
			UniUtil.toastSuccess('质押交易发送成功', () => {
				setTimeout(() => {
					uni.redirectTo({ url: './pledgePage' })
				}, 1000)
			})
		} else {
			UniUtil.toastError('质押交易发送失败，请重试')
		}
	} catch (e) {
		console.error(e)
		UniUtil.toastError('质押交易发送失败')
	}

	UniUtil.loadHide()
}
</script>


<style lang="scss" scoped>
.home-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100vw;
	height: 100vh;
	padding: 0rpx 31rpx;
	box-sizing: border-box;
	background-color: #f7f7f7;
	background-size: 100% 100%;
	box-sizing: border-box;

	.pledgeBox {
		display: block;
		width: 577rpx;
		height: 332rpx;
		margin-top: 46rpx;
	}

	.title {
		width: 617rpx;
		height: 26rpx;
		font-family: PingFang;
		font-weight: bold;
		font-size: 26rpx;
		color: #1D1F20;
		line-height: 26rpx;
		margin-top: 44rpx;
		padding-left: 36rpx;
		box-sizing: border-box;
	}

	.inputBox {
		width: 617rpx;
		height: 79rpx;
		background: #FFFFFF;
		border-radius: 39rpx;
		margin-top: 39rpx;

		input {
			width: 100%;
			height: 100%;
			padding-left: 36rpx;
			padding-right: 36rpx;
			box-sizing: border-box;
		}
	}

	.walletBalance {
		width: 617rpx;
		height: 24rpx;
		font-family: PingFang;
		font-weight: 500;
		font-size: 24rpx;
		color: #838383;
		line-height: 24rpx;
		margin-top: 28rpx;
		padding-left: 36rpx;
		box-sizing: border-box;
	}

	.textareaFont {
		font-family: PingFang;
		font-weight: 500;
		font-size: 25rpx;
		color: #A2A4B0;
	}

}

.confirmButton {
	margin-top: 64rpx;
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
</style>