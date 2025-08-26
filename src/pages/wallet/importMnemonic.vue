<template>
    <view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
        <titleBar title='助记词导入' :isShowScanCode='true' @scanSuccess='scan'></titleBar>
        <view class="tipWordsBox">
            <textarea class="textarea" type="text" placeholder="助记词,请用空格分割" v-model="param.importWallet.mnemonic"
                placeholder-class="textareaFont" />
        </view>
        <view class="paramsList">
            <view class="paramsItem">
                <view class="paramsTitle">
                    钱包名称
                </view>
                <view class="paramsInputBox">
                    <input type="text" :placeholder="param.placeholderName" v-model="param.importWallet.name"
                        placeholder-class="textareaFont" />
                </view>
            </view>
            <view class="paramsItem" v-if="param.isExistsWallet">
                <view class="paramsTitle">
                    钱包密码
                </view>
                <view class="paramsInputBox">
                    <input type="password" placeholder="请输入密码,至少8位数" v-model="param.importWallet.password"
                        placeholder-class="textareaFont" />
                </view>
                <view class="paramsInputBox">
                    <input type="password" placeholder="重复密码" v-model="param.importWallet.rePassword"
                        placeholder-class="textareaFont" />
                </view>
            </view>

            <view class="paramsItem" v-if="param.isExistsWallet">
                <view class="paramsTitle">
                    提示信息(选填)
                </view>
                <view class="paramsInputBox">
                    <input type="text" placeholder="密码提示信息" v-model="param.importWallet.tips"
                        placeholder-class="textareaFont" />
                </view>
            </view>
        </view>
        <TermAndPrivacy :termPrivacyAgree="termPrivacyStatus" @termPrivacyAgree="handleTermPrivacyAgree">
        </TermAndPrivacy>
        <view class="confirmButton" @click="importWallet">
            导入钱包
        </view>
    </view>
</template>

<script setup lang="ts">
import Vue from 'vue';
import TermAndPrivacy from "../../components/termAndPrivacy.vue";
import { WalletData } from '@/data/wallet/walletData';
import { ACCOUNT_TYPE, CHAIN_TYPE, STORAGE_TYPE } from '@/data/constants';
import { BitAccount } from '@/chain/bit/account/account';
import { CheckUtil } from '@/data/util/checkUtil';
import { UniUtil } from "@/data/util/uniUtil";
import { onLoad } from '@dcloudio/uni-app';


const termPrivacyStatus = ref(false);

const param = reactive({
    isExistsWallet: false,
    placeholderIndex: '1',
    placeholderName: "",
    importWallet: {
        mnemonic: "",
        name: "",
        password: "",
        rePassword: "",
        tips: "",
    }
});

const statusBarHeight = ref(0);

onLoad(() => {
    const systemInfo = uni.getSystemInfoSync();
    statusBarHeight.value = systemInfo.statusBarHeight! + 15;

    // 钱包名称索引加载
    const index = uni.getStorageSync(STORAGE_TYPE.WALLET_INDEX);
    param.placeholderIndex = index === '' ? '1' : (parseInt(index) + 1).toString();
    param.placeholderName = "WALLET-".concat(param.placeholderIndex);

    // 是否需要输入密码
    param.isExistsWallet = WalletData.account.address === undefined;
})


const handleTermPrivacyAgree = (value: boolean) => {
    termPrivacyStatus.value = value;
};

const importWallet = async () => {
    UniUtil.loadShow();
    const { mnemonic, name, password, rePassword, tips } = param.importWallet;
    let nameTmp = name;
    if (CheckUtil.isStrEmpty(name)) {
        nameTmp = param.placeholderName;
    }

    // check
    if (CheckUtil.isStrEmptyAndMessage(mnemonic, "请输入助记词")) return;
    if (CheckUtil.isStrEmptyAndMessage(nameTmp, "请输入钱包名称")) return;
    if (param.isExistsWallet && CheckUtil.isStrEmptyAndMessage(password, "请输入钱包密码")) return;
    if (param.isExistsWallet && !CheckUtil.lengthRangeEqAndMessage(password, "密码至少需要8位数", 8)) return;
    if (param.isExistsWallet && CheckUtil.isStrEmptyAndMessage(rePassword, "请输入钱包重复密码")) return;
    if (param.isExistsWallet && !CheckUtil.isStrSameAndMessage(password, rePassword, "密码不一致")) return;

    if (!termPrivacyStatus.value) {
        UniUtil.toastError('请查看并同意条款');
        return;
    }

    // import
    const importParam: WalletBit.Account.ImportMnemonicDto = {
        mnemonic
    }

    try {
        const data = await BitAccount.importMnemonic(importParam);
        const account: Wallet.Account = {
            name: nameTmp,
            address: data.address,
            secretInfo: {
                mnemonic: mnemonic,
                privateKey: data.privateKey,
                path: data.path
            },
            type: ACCOUNT_TYPE.IMPORT,
        };
        const user: Wallet.UserInfo = { password, tips };

        WalletData.import(CHAIN_TYPE.BIT, account, false, user);

        // 缓存钱包index
        uni.setStorageSync(STORAGE_TYPE.WALLET_INDEX, param.placeholderIndex);

        UniUtil.loadHide();

        UniUtil.toastSuccess('导入成功', () => {
            setTimeout(() => {
                uni.reLaunch({
                    url: '../home/index'
                });
            }, 200);
        });
    } catch (e) {
        console.log(e);
        if (e.message.startsWith('invalid mnemonic length')) {
            UniUtil.toastError('助记词不匹配，请重新输入');
        } else {
            UniUtil.toastError(e.message);
        }
    }
}

const scan = (res:string) => {
    param.importWallet.mnemonic = res
}
</script>

<style lang="scss" scoped>
	.home-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		min-height: 100vh;
		padding: 0rpx 31rpx 20rpx 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.tipWordsBox {
			margin-top: 59rpx;
			width: 688rpx;
			height: 308rpx;
			background: #FFFFFF;
			border-radius: 25rpx;

			padding: 39rpx 32rpx;
			box-sizing: border-box;

			textarea {
				width: 100%;
				height: 100%;
				font-family: PingFang;
				font-weight: 500;
				font-size: 28rpx;

			}
		}

		.paramsList {
			width: 100%;
			margin-top: 44rpx;
			// background-color: pink;

			.paramsItem {
				width: 100%;
				min-height: 86rpx;
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
						font-family: PingFang;
						font-weight: 500;
						font-size: 28rpx;
					}
				}
			}
		}
		.confirmButton {
			margin-top: 406rpx;
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
	}
</style>