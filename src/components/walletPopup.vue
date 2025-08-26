<template>
	<view class="walletPopup" v-if="props.show">
		<view class="popup" @click="close">

		</view>
		<view class="walletListBox">
			<view class="header">
				钱包列表
			</view>
			<image src="@/static/newUI3/index/closeIcon.png" mode="aspectFill" class="closeIcon" @click="close()">
			</image>
			<view class="divider">
			</view>
			<view class="walletList" v-if="accounts.length > 0">
				<view class="walletItem" v-for="(item, index) in accounts" :key="index"
					@click.stop="changeAccount(item.account)"
					:class="item.address == activeAddress ? 'activeWalletItem' : ''">
					<view class="walletName" :class="item.address == activeAddress ? 'activeClass' : ''">
						{{ item.name }} <text v-show="item.type === 2" class="tips"
							:class="item.address == activeAddress ? 'activeClass' : ''">[观察钱包]</text>
					</view>
					<view class='walletAddress'>
						{{ item.addressShow }}
						<image src="@/static/newUI3/transaction/copy2.png" mode="aspectFill" class="copyIcon"
							@click.stop="copyAddress(item.address)" v-if="item.address == activeAddress"></image>
						<image src="@/static/newUI3/transaction/copy.png" mode="aspectFill" class="copyIcon"
							@click.stop="copyAddress(item.address)" v-else></image>
					</view>
					<view class="walletBalance" :class="item.address == activeAddress ? 'activeClass' : ''">
						{{ item.num }}
					</view>
				</view>
			</view>
			<view class="buttonList">
				<view class="button" @click="gotoPage('../wallet/createWay')">
					创建钱包
				</view>
				<view class="button" @click="gotoPage('../wallet/importWay')">
					导入钱包
				</view>
			</view>
		</view>
	</view>
</template>


<script setup lang="ts">
import Vue from 'vue';
import { CHAIN_TYPE } from '@/data/constants';
import { WalletData } from '@/data/wallet/walletData';
import { BitAccount } from '@/chain/bit/account/account';
import { ShowUtil } from '@/data/util/showUtil';
import { UniUtil } from '@/data/util/uniUtil';
import { onLoad } from '@dcloudio/uni-app';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	url: {
		type: String,
		default: ''
	},
})


const param = ref({
	chainActive: CHAIN_TYPE.BIT,
	existsMnemonic: true,
});

const chain = ref([]);

interface accountItem {
	name: string;
	address: string;
	addressShow: string;
	num: string;
	account: Wallet.Account;
	type: number;
}
const accounts = ref<accountItem[]>([]);

const activeAddress = ref('');

onLoad(async () => {
	const { address } = WalletData.account;
	// console.log(address,'当前钱包地址');
	activeAddress.value = address
	const accountChains = WalletData.accountChainMap[param.value.chainActive];
	for (const accountChain of accountChains) {
		const { name, address, type } = accountChain;
		try {
			const rs = await BitAccount.getAssets(address, [], true, 1, 100) as any;
			const datas = rs.data;
			datas.map((data: any) => {
				if (data.tokenType === 'BIT') {
					accounts.value.push({
						name,
						address,
						addressShow: ShowUtil.omitAddress(address, 8, 8),
						num: data.balance,
						account: accountChain,
						type: type,
					});
				}
			});
		} catch {

		}

	}
	// 是否存在钱包助记词
	param.value.existsMnemonic = WalletData.existsWalletMnemonic();
});

const gotoPage = (url: string) => {
	uni.navigateTo({
		url
	});
}
const copyAddress = (address: string) => {
	UniUtil.copy(address);
}

const emit = defineEmits(['walletPopupshow'])
const close = () => {
	emit('walletPopupshow', false)
}
const handleNavClick = (chainActive: CHAIN_TYPE) => {
	param.value.chainActive = chainActive;
	accounts.value = []
}
const changeAccount = (account: Wallet.Account) => {
	WalletData.chooseAccount(account);
	uni.reLaunch({
		url: props.url
	});
}


</script>

<style lang="scss" scoped>
.walletPopup {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	width: 100vw;
	height: 100vh;

	.popup {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 3;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.walletListBox {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 70vh;
		z-index: 4;
		background-color: #fff;
		border-top-left-radius: 30rpx;
		border-top-right-radius: 30rpx;
		padding-top: 56rpx;
		box-sizing: border-box;

		.header {
			width: 100%;
			height: 30rpx;
			font-family: PingFang;
			font-weight: bold;
			font-size: 30rpx;
			color: #231815;
			line-height: 30rpx;
			text-align: center;
			// ps
			// background-color: pink;
		}

		.closeIcon {
			position: absolute;
			top: 50rpx;
			right: 31rpx;
			display: block;
			width: 31rpx;
			height: 33rpx;
		}

		.divider {
			margin-top: 33rpx;
			width: 750rpx;
			height: 1rpx;
			background: #EBEBEB;
		}

		.walletList {
			width: 100%;
			// height:calc(60vh - 173rpx) ;
			height: calc(65vh - 253rpx);
			overflow-y: auto;
			margin-top: 53rpx;
			padding: 0rpx 31rpx;
			box-sizing: border-box;
			// ps
			// background-color: skyblue;

			.walletItem {
				width: 100%;
				height: 185rpx;
				background: #F7F7F7;
				border-radius: 25rpx;
				padding: 38rpx 44rpx 24rpx 38rpx;
				box-sizing: border-box;
				margin-bottom: 20rpx;

				.walletName {
					width: 100%;
					height: 27rpx;
					font-family: PingFang;
					font-weight: bold;
					font-size: 27rpx;
					color: #231815;
					line-height: 27rpx;

					.tips {
						font-size: 20rpx;
						line-height: 24rpx;
						margin-left: 10rpx;
						font-weight: 400;
						color: #838383;
						line-height: 27rpx;
					}

				}


				.walletAddress {
					display: flex;
					width: 100%;
					height: 27rpx;
					font-family: PingFang;
					font-weight: 500;
					font-size: 27rpx;
					color: #A2A4B0;
					line-height: 27rpx;
					margin-top: 10rpx;

					.copyIcon {
						display: block;
						width: 25rpx;
						height: 27rpx;
						margin-left: 25rpx;
					}
				}

				.walletBalance {
					width: 100%;
					height: 24rpx;
					font-family: PingFang;
					font-weight: bold;
					font-size: 24rpx;
					color: #1D1F20;
					line-height: 24rpx;
					text-align: end;
					margin-top: 35rpx;
				}
			}

			.activeWalletItem {
				background-color: #1d1f20 !important;
			}
		}
	}

	.activeClass {
		color: #fff !important;
	}

	.buttonList {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 79rpx;
		margin-top: 40rpx;
		padding: 0rpx 31rpx;
		box-sizing: border-box;

		.button {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 308rpx;
			height: 79rpx;
			background: #1D1F20;
			border-radius: 39rpx;

			font-family: PingFang;
			font-weight: 800;
			font-size: 28rpx;
			color: #FFFFFF;
		}
	}
}
</style>