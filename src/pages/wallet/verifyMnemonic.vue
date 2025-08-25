<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
		<titleBar title='验证助记词'></titleBar>
		<view class="tips">
			请根据您抄写的助剂词，按顺序选择填充
		</view>
		<view class="keywordList">
			<view class="keywordItem" v-for="(item, index) in mnemonicsRes" :key="index"
				:style="active === index ? { border: '1px solid #e0e0e0' } : {}" @click="choose(index)">
				{{ item }}
			</view>
		</view>
		<view class="keywordList2">
			<view v-for="(item, index) in mnemonics" :key="index" @click="fillChoose(index)" class="keywordItem">
				{{ item }}
			</view>
		</view>
		<view class="confirmButton" @click="verify">
			确认
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { STORAGE_TYPE, CHAIN_TYPE, ACCOUNT_TYPE } from "@/data/constants";
import { UniUtil } from "@/data/util/uniUtil";
import { CheckUtil } from "@/data/util/checkUtil";
import { BitAccount } from "@/chain/bit/account/account";
import { WalletData } from "@/data/wallet/walletData";

// 当前激活下标
const active = ref(0);

// 助记词填充结果（12 个空位）
const mnemonicsRes = ref<string[]>(["", "", "", "", "", "", "", "", "", "", "", ""]);

// 打乱顺序后的助记词
const mnemonics = ref<string[]>([]);

// 临时存储的助记词数据
const mnemonicTmpData = ref({
  name: "",
  mnemonic: "",
  index: null,
});


const statusBarHeight = ref(0);


onLoad(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = (systemInfo.statusBarHeight || 0) + 15;

  mnemonicTmpData.value = uni.getStorageSync(STORAGE_TYPE.MNEMONIC_TEMP_INFO);
  mnemonics.value = CheckUtil.shuffleArray(mnemonicTmpData.value.mnemonic.toString().split(' '));
});

// 选择位置
const choose = (index: number) => {
  active.value = index;
  fill("");
};

// 选择某个助记词填入
const fillChoose = (index: number) => {
  fill(mnemonics.value[index]);

  if (active.value < 11) {
    active.value++;
  }
};

// 填充助记词----(此处重新写了一下逻辑)
const fill = (mnemonic: string) => {
  const temp = [...mnemonicsRes.value];
  temp[active.value] = mnemonic;
  mnemonicsRes.value = temp;


};

// 验证助记词顺序
const verify = async () => {
  if (mnemonicsRes.value.join(" ") !== mnemonicTmpData.value.mnemonic) {
    UniUtil.toastError("验证失败，请按顺序选择填充");
    return;
  }

  try {
    const mnemonicTmp = mnemonicTmpData.value.mnemonic;
    const importParam: WalletBit.Account.ImportMnemonicDto = { mnemonic: mnemonicTmp };

    const data = await BitAccount.importMnemonic(importParam);

    const account: Wallet.Account = {
      name: mnemonicTmpData.value.name,
      address: data.address,
      secretInfo: {
        mnemonic: mnemonicTmp,
        privateKey: data.privateKey,
        path: data.path,
      },
      type: ACCOUNT_TYPE.NORMAL,
    };

    WalletData.import(CHAIN_TYPE.BIT, account, false);

    // 缓存钱包索引
    uni.setStorageSync(STORAGE_TYPE.WALLET_INDEX, mnemonicTmpData.value.index);

    // 移除临时数据
    uni.removeStorageSync(STORAGE_TYPE.MNEMONIC_TEMP_INFO);

    UniUtil.toastSuccess("验证成功", () => {
      setTimeout(() => {
        uni.reLaunch({
          url: "../home/index",
        });
      }, 200);
    });
  } catch (e: any) {
    console.log(e);
    if (e.message && e.message.startsWith("invalid mnemonic length")) {
      UniUtil.toastError("助记词不匹配，请重新输入");
    } else {
      UniUtil.toastError(e.message || "验证失败");
    }
  }
};
</script>


<style lang="scss" scoped>
.home-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100vw;
	min-height: 100vh;
	padding: 0rpx 31rpx;
	box-sizing: border-box;
	background-color: #f7f7f7;
	background-size: 100% 100%;
	box-sizing: border-box;

	.tips {
		margin-top: 59rpx;
		width: 100%;
		height: 25rpx;
		font-family: PingFang;
		font-weight: 500;
		font-size: 25rpx;
		color: #A2A4B0;
		line-height: 25rpx;
	}

	.keywordList {
		margin-top: 64rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		width: 688rpx;
		height: 370rpx;
		background: #FFFFFF;
		border-radius: 25rpx;
		padding: 33rpx 16rpx;
		box-sizing: border-box;

		.keywordItem {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 204rpx;
			height: 62rpx;
			background: #F7F7F7;
			border-radius: 19rpx;
		}
	}

	.keywordList2 {
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		width: 688rpx;
		height: 370rpx;
		background: #f7f7f7;
		border-radius: 25rpx;
		padding: 33rpx 16rpx;
		box-sizing: border-box;

		.keywordItem {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 204rpx;
			height: 62rpx;
			background: #fff;
			border-radius: 19rpx;
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
</style>