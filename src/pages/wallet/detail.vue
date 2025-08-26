<template>
    <view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
        <titleBar title='钱包详情'></titleBar>
        <view class="walletBox">
            <image src="@/static/newUI3/transaction/bit.png" mode="aspectFill" class="walletIcon"></image>
            <view class="walletInfo">
                <view class="row">
                    <view class="walletName">
                        {{ show.name }}
                    </view>
                    <image src="@/static/newUI3/transaction/editWalletName.png" mode="aspectFill" class="editWalletName"
                        @click="gotoPage('./update')"></image>
                </view>
                <view class="row">
                    <view class="walletAdress">
                        {{ show.address }}
                    </view>
                    <image src="@/static/newUI3/transaction/copy.png" mode="aspectFill" class="copy"
                        @click="copyAddress"></image>
                </view>
            </view>
        </view>
        <view class="card">
            <view class="methodsBox" @click="exportFun(1)" v-if="param.isShowPriKey">
                <view class="methodsName">
                    导出私钥
                </view>
                <image src="@/static/newUI3/transaction/rightTriangle.png" mode="aspectFill" class="rightTriangle">
                </image>
            </view>
            <view class="methodsBox" @click="exportFun(2)" v-if="param.isShowMnemonic">
                <view class="methodsName">
                    导出助记词
                </view>
                <image src="@/static/newUI3/transaction/rightTriangle.png" mode="aspectFill" class="rightTriangle">
                </image>
            </view>
            <view class="methodsBox" @click="gotoPage('/pages/my/manageWallet')">
                <view class="methodsName">
                    管理钱包
                </view>
                <image src="@/static/newUI3/transaction/rightTriangle.png" mode="aspectFill" class="rightTriangle">
                </image>
            </view>
        </view>
        <view class="card">
            <view class="methodsBox" @click="gotoPage('/pages/my/update')">
                <view class="methodsName">
                    修改密码
                </view>
                <image src="@/static/newUI3/transaction/rightTriangle.png" mode="aspectFill" class="rightTriangle">
                </image>
            </view>
            <!-- 	<view class="methodsBox" @click="showToast">
				<view class="methodsName">
					重置密码
				</view>
				<image src="@/static/newUI3/transaction/rightTriangle.png" mode="aspectFill" class="rightTriangle">
				</image>
			</view> -->

        </view>
        <view class="confirmButton" @click="deleteWallet">
            删除钱包
        </view>
        <PasswordPopup></PasswordPopup>
    </view>
</template>

<script setup lang="ts">
import Vue from 'vue';
import { WalletData } from '@/data/wallet/walletData';
import { ShowUtil } from "@/data/util/showUtil";
import PasswordPopup from "@/components/password/passwordPopup.vue";
import { UniUtil } from "@/data/util/uniUtil";
import { CheckUtil } from '@/data/util/checkUtil';
import { BitInstance } from '@/chain/bit/instance';
import { onLoad, onShow } from '@dcloudio/uni-app';

import { passwordPopup } from '@/components/password/index'
import { useMessageStore } from '@/store/modules/Message'
const messageStore = useMessageStore()

const param = ref({
    isShowPriKey: false,
    isShowMnemonic: false,
    showEditName: false,
});

const show = ref({
    address: '',
    name: '',
});

const value = ref({
    address: '',
});

const statusBarHeight = ref(0);

onLoad(() => {
    const systemInfo = uni.getSystemInfoSync();
    statusBarHeight.value = systemInfo.statusBarHeight! + 15;
})

onShow(() => {
    const { address, name, secretInfo } = WalletData.account;
    show.value.address = ShowUtil.omitAddress(address, 8, 8);
    show.value.name = name;
    value.value.address = address;

    // 是否展示按钮
    if (secretInfo.privateKey !== undefined) {
        param.value.isShowPriKey = secretInfo.privateKey != '';
    }
    if (secretInfo.mnemonic !== undefined) {
        param.value.isShowMnemonic = secretInfo.mnemonic != '';
    }
});

const copyAddress = () => {
    UniUtil.copy(value.value.address);
};

const exportFun = async (type: number) => {
    try {
        
    } catch {

    }
};

const deleteWallet = async () => {
    if (WalletData.account.type === 2) {
        await WalletData.removeAccount();
        uni.reLaunch({
            url: '../home/index'
        });
    } else {
        const rs = await new Promise<void>((resolve, reject) => {
            UniUtil.loadHide()
            messageStore.changePasswordPopConfig({
                title: '验证密码',
                show: true,
                password: '',
                confirm: async (data: string) => {
                    if (CheckUtil.isStrEmptyAndMessage(data, "请输入密码")) return

                    try {
                        await WalletData.privateKey(data)
                        await WalletData.removeAccount()
                        uni.reLaunch({ url: '../home/index' })
                        resolve()
                    } catch (e) {
                        reject(e)
                    } finally {
                        // 关闭弹窗
                        messageStore.changePasswordPopConfig({ show: false })
                    }
                }
            })
        })
    }
};

const gotoPage = (url: string) => {
    uni.navigateTo({
        url
    })
};

const showToast = () => {
    uni.showToast({
        title: `功能待定`, // 提示的内容
        icon: 'none', // 图标，有效值 'success'、'loading'、'none'
        duration: 2000, // 提示的延迟时间，单位毫秒，默认 1500
        mask: false // 是否显示透明蒙层，防止触摸穿透，默认 false
    });
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

    .walletBox {
        margin-top: 59rpx;

        display: flex;
        align-items: center;
        width: 688rpx;
        height: 157rpx;
        background: #FFFFFF;
        border-radius: 12rpx;
        padding: 36rpx;
        box-sizing: border-box;

        .walletIcon {
            display: block;
            width: 85rpx;
            height: 85rpx;
            margin-right: 15rpx;
        }

        .walletInfo {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            height: 64rpx;

            // background-color: skyblue;
            .row {
                display: flex;

                .walletName {
                    height: 27rpx;
                    font-family: PingFang;
                    font-weight: bold;
                    font-size: 27rpx;
                    color: #231815;
                    line-height: 27rpx;
                }

                .editWalletName {
                    display: block;
                    width: 30rpx;
                    height: 28rpx;
                    margin-left: 45rpx;
                }

                .walletAdress {
                    height: 27rpx;
                    font-family: PingFang;
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #A2A4B0;
                    line-height: 27rpx;
                }

                .copy {
                    display: block;
                    width: 25rpx;
                    height: 27rpx;
                    margin-left: 41rpx;
                }
            }

        }
    }

    .card {
        margin-top: 20rpx;
        width: 688rpx;
        // height: 278rpx;
        background: #FFFFFF;
        border-radius: 25rpx;
        padding: 4rpx 35rpx;
        box-sizing: border-box;

        .methodsBox {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 89rpx;
            border-bottom: 1rpx dashed #ccc;

            .methodsName {
                font-family: PingFang;
                font-weight: bold;
                font-size: 28rpx;
                color: #231815;
                line-height: 28rpx;
            }

            .rightTriangle {
                display: block;
                width: 12rpx;
                height: 21rpx;
            }
        }

        & .methodsBox:last-child {
            border: none;
        }
    }

    .confirmButton {
        margin-top: 556rpx;
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