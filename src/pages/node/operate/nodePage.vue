<template>
    <view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
        <titleBar title='全网总质押'></titleBar>
        <view class="pledgeQuantity">
            <view class="header">
                全网总质押（BIT）
            </view>
            <view class="pledgeQuantityNumber">
                {{ show.totalPledgeNum }}
            </view>
        </view>
        <view class="titleBox">
            节点排名
        </view>
        <view class="recordBox">
            <view class="recordHeader">
                <view class="recordHeaderItem">
                    序号
                </view>
                <view class="recordHeaderItem">
                    节点
                </view>
                <view class="recordHeaderItem">
                    质押量
                </view>
                <view class="recordHeaderItem">
                    区块高度
                </view>
            </view>
            <view class="recordList">
                <block v-if="records.length > 0">
                    <view class="recordItem" v-for="(item, index) in records" :key="index">
                        <view class="recordText">{{ index + 1 }}</view>
                        <view class="recordText">{{ item.nodeShow }}</view>
                        <view class="recordText">{{ item.pledge }}</view>
                        <view class="recordText">{{ item.blockNum }}</view>
                    </view>
                </block>
                <block v-else>
                    <view class='noMoreData'>暂无数据</view>
                </block>
            </view>
        </view>
        <view class='confirmButton' @click="gotoPage('./pledge/pledge')">
            质押
        </view>
    </view>
</template>


<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { BitInstance } from '@/chain/bit/instance'
import { UniUtil } from "@/data/util/uniUtil"
import { ShowUtil } from "@/data/util/showUtil"
import type { Witness } from 'bitweb-ts/lib/esm/types/Trx'


const show = reactive({
  totalPledgeNum: ''
})

const records = ref<Array<{
  node: string
  nodeShow: string
  pledge: number
  blockNum: number
}>>([])

const witnesses = ref<Witness[]>([])

const statusBarHeight = ref(0)


onLoad(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = (systemInfo.statusBarHeight || 0) + 15
})

onShow(async () => {
  UniUtil.loadShow()
  let totalPledgeNum = 0
  witnesses.value = []

  try {
    const witnessArr = await BitInstance.bitweb.trx.listSuperRepresentatives()
    witnessArr.forEach((witness: Witness) => {
      if (witness.voteCount === undefined) witness.voteCount = 0
      if (witness.latestBlockNum === undefined) witness.latestBlockNum = 0

      witness.address = BitInstance.bitweb.address.fromHex(witness.address)
      witnesses.value.push(witness)

      totalPledgeNum += witness.voteCount
    })

    witnesses.value.sort((a, b) => b.voteCount - a.voteCount)
  } catch (e) {
    console.error(e)
  }

  records.value = witnesses.value.map((witness: Witness) => ({
    node: witness.address,
    nodeShow: ShowUtil.omitAddress(witness.address, 6, 6),
    pledge: witness.voteCount,
    blockNum: witness.latestBlockNum
  }))

  show.totalPledgeNum = totalPledgeNum.toString()
  UniUtil.loadHide()
})


function gotoPage(url: string) {
  uni.navigateTo({ url })
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

    .pledgeQuantity {
        margin-top: 63rpx;
        width: 688rpx;
        height: 179rpx;
        background: #FFFFFF;
        border-radius: 25rpx;
        padding: 19rpx 36rpx 25rpx 36rpx;
        box-sizing: border-box;

        .header {
            width: 100%;
            height: 24rpx;
            font-family: PingFang;
            font-weight: bold;
            font-size: 24rpx;
            color: #1D1F20;
            line-height: 24rpx;
        }

        .pledgeQuantityNumber {
            margin-top: 19rpx;
            width: 617rpx;
            height: 93rpx;
            background: #F7F7F7;
            border-radius: 25rpx;
            padding: 36rpx 16rpx 38rpx 16rpx;
            box-sizing: border-box;

            font-family: PingFang;
            font-weight: 500;
            font-size: 25rpx;
            color: #838383;
            line-height: 24rpx;
        }
    }

    .titleBox {
        margin-top: 58rpx;
        width: 100%;
        height: 29rpx;
        font-family: PingFang;
        font-weight: bold;
        font-size: 29rpx;
        text-align: start;
        color: #231815;
        line-height: 29rpx;
    }

    .recordBox {
        margin-top: 35rpx;
        width: 688rpx;
        height: 933rpx;
        background: #FFFFFF;
        border-radius: 25rpx;

        .recordHeader {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 93rpx;
            padding: 0rpx 17rpx;
            border-bottom: 1rpx solid #e6e6e6;
            box-sizing: border-box;

            // ps
            // background-color: pink;
            .recordHeaderItem {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 158rpx;
                height: 93rpx;
                font-family: PingFang;
                font-weight: 800;
                font-size: 22rpx;
                color: #231815;
                line-height: 22rpx;
            }
        }

        .recordList {

            width: 100%;
            height: 832rpx;
            overflow-y: auto;
            padding: 0rpx 17rpx;
            box-sizing: border-box;


            .recordItem {
                display: flex;
                justify-content: space-between;
                width: 100%;
                height: 105rpx;
                border-bottom: 1rpx dashed #e6e6e6;
                box-sizing: border-box;

                .recordText {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 158rpx;
                    height: 104rpx;

                    font-size: 26rpx;
                    color: #8b8b8b;
                    text-align: center;
                    line-height: 30rpx;

                    font-family: XiQuejuzhenti-regular;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                }
            }

            & .recordItem:last-child {
                // border-bottom: none;
            }
        }

    }

}

.noMoreData {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    // height: 25rpx;
    text-align: center;
    font-family: PingFang;
    font-weight: 500;
    font-size: 25rpx;
    color: #A2A4B0;
    line-height: 25rpx;
}

.confirmButton {
    margin-top: 81rpx;
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