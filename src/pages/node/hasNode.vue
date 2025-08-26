<template>
	<view class='home-page' :style="{ paddingTop: statusBarHeight + 'px' }">
		<navigationBar searchKeyWord='BIT节点计划' :isHome="false"></navigationBar>
		<view class="assetsTypeTab">
			<view class="assetsTypeItem" @click="changeSelectType('pledge')">
				<view class="assetsTypeText" :class="selectType == 'pledge' ? 'activeAssetsTypeText' : ''">
					质押
				</view>
				<view class="assetsTypeLine" :class="selectType == 'pledge' ? 'activeAssetsTypeLine' : ''">
				</view>
			</view>
			<view class="assetsTypeItem" @click="changeSelectType('vote')">
				<view class="assetsTypeText" :class="selectType == 'vote' ? 'activeAssetsTypeText' : ''">
					投票
				</view>
				<view class="assetsTypeLine" :class="selectType == 'vote' ? 'activeAssetsTypeLine' : ''">
				</view>
			</view>
			<view class="assetsTypeItem" @click="changeSelectType('profit')">
				<view class="assetsTypeText" :class="selectType == 'profit' ? 'activeAssetsTypeText' : ''">
					收益
				</view>
				<view class="assetsTypeLine" :class="selectType == 'profit' ? 'activeAssetsTypeLine' : ''">

				</view>
			</view>
		</view>
		<!-- 详情框 -->
		<view class="dataDetail">
			<block v-if="selectType == 'pledge'">
				<view class="header">
					<view class="assetsName">
						全网总质押量
					</view>
					<view class='assetsDetailIcon' @click="gotoPage('./operate/nodePage')">
						详情 <image src="@/static/newUI3/node/lowerTriangle.png" mode="scaleToFill" class="lowerTriangle">
						</image>
					</view>
				</view>
				<view class="networkTotal">
					{{ statistic.totalPledgeNum }}
				</view>
				<view class="personTotal" @click="gotoPage('./operate/pledge/pledgePage')">
					个人总质押量:<text class="personTotalNumber">{{ statistic.totalPersonPledgeNum }} BIT</text>
				</view>
			</block>
			<block v-else-if="selectType == 'vote'">
				<view class="header">
					<view class="assetsName">
						个人总投票(BIT)
					</view>
					<view class='assetsDetailIcon' @click="gotoPage('./operate/vote/votePage')">
						详情 <image src="@/static/newUI3/node/lowerTriangle.png" mode="scaleToFill" class="lowerTriangle">
						</image>
					</view>

				</view>
				<view class="networkTotal">
					{{ statistic.personalVoteNum }}

				</view>
				<view class="personTotal">
					本轮投票倒计时:<text class="personTotalNumber">{{ cutDown.hour }} : {{ cutDown.min }}:{{ cutDown.second
						}}</text>
				</view>
			</block>
			<block v-else-if="selectType == 'profit'">
				<view class="header">
					<view class="assetsName">
						累计收益(BIT)
					</view>

				</view>
				<view class="networkTotal">
					{{ statistic.totalReward }}
				</view>
				<view class="personTotal">
					可提取收益:<text class="personTotalNumber">{{ statistic.currentReward }}</text>
				</view>
			</block>

			<view class="methodsBox">
				<view class="methodsItem activeMethodsItem" @click="gotoPage('./operate/pledge/pledge')">
					质押
				</view>
				<view class="methodsItem" @click="gotoPage('./operate/withdraw/withdraw')">
					提取
				</view>
				<view class="methodsItem" @click="gotoPage('./operate/vote/vote')">
					投票
				</view>
				<view class="methodsItem" @click="gotoPage('./operate/proposal/page')">
					提案
				</view>
			</view>
		</view>
		<view class="nodeListBox">
			<view class="header">
				<view class="nodeTypeList">
					<view class="nodeType" @click="handleAssetTabClick('super')">
						<view class="nodeTypeName" :class="param.assetActive === 'super' ? 'activeNodeTypeName' : ''">
							超级节点
						</view>
						<view class="nodeTypeLine" :class="param.assetActive === 'super' ? 'activeNodeTypeLine' : ''">
						</view>
					</view>
					<view class="nodeType" @click="handleAssetTabClick('sentry')">
						<view class="nodeTypeName" :class="param.assetActive === 'sentry' ? 'activeNodeTypeName' : ''">
							哨兵节点
						</view>
						<view class="nodeTypeLine" :class="param.assetActive === 'sentry' ? 'activeNodeTypeLine' : ''">
						</view>
					</view>
					<view class="nodeType" @click="handleAssetTabClick('campaign')">
						<view class="nodeTypeName"
							:class="param.assetActive === 'campaign' ? 'activeNodeTypeName' : ''">
							竞选节点
						</view>
						<view class="nodeTypeLine"
							:class="param.assetActive === 'campaign' ? 'activeNodeTypeLine' : ''">
						</view>
					</view>
					<view class="line"></view>
				</view>

				<view class="searchBox" @click="gotoPage('./search')">
					<image src="@/static/newUI3/index/searchIcon2.png" mode="widthFix" class="searchIcon"></image>
					<view class="searchText">
						搜索节点
					</view>
				</view>
			</view>
			<view class="divider">

			</view>
			<view class="main">

				<view class="tableHeader">
					<view class="tableHeaderItem">
						序号
					</view>
					<view class="tableHeaderItem2">
						节点
					</view>
					<view class="tableHeaderItem2">
						质押量
					</view>
					<view class="tableHeaderItem2">
						区块高度
					</view>

				</view>
				<block v-if="records.length > 0">
					<view class="tableMain">
						<view class="nodeItem" v-for="(item, index) in records" :key="index"
							@click="gotoPage('./operate/vote/vote?address=' + item.node)">
							<view class="nodeText">
								{{ index + 1 }}
							</view>
							<view class="nodeText2">
								{{ item.nodeShow }}
							</view>
							<view class="nodeText2">
								{{ item.pledge }}
							</view>
							<view class="nodeText2">
								{{ item.blockNum }}
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="tips">
						暂无数据
					</view>
				</block>
			</view>


		</view>
		<wallet-tabbar :currentIndex='1'></wallet-tabbar>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
// import Empty from "@/components/empty.vue";
// import WalletPopup from "../../components/walletPopup.vue";
import navigationBar from "@/components/navigationBar.vue";
import { WalletData } from '@/data/wallet/walletData';
import { BitInstance } from '@/chain/bit/instance';
import { BitAccount } from '@/chain/bit/account/account';
import { UniUtil } from "@/data/util/uniUtil";
import { Frozen, Witness } from 'bitweb-ts/lib/esm/types/Trx';
import { ShowUtil } from '@/data/util/showUtil';


const props = defineProps({
	refresh: {
		type: Number,
		default: 0
	}
})




// 定义响应式数据类型
interface ParamType {
	assetActive: 'super' | 'sentry' | 'campaign';
	show: boolean;
	recordsEmpty: boolean;
}

interface AccountType {
	name: string;
	bitNum: number;
	address: string;
	isWitness: boolean;
}

interface RecordItem {
	node: string;
	nodeShow: string;
	pledge: number;
	blockNum: number;
}






const param = ref<ParamType>({
	assetActive: 'super',
	show: false,
	recordsEmpty: false,
});

const account = ref<AccountType>({
	name: '',
	bitNum: 0,
	address: '',
	isWitness: false,
});

const records = ref<RecordItem[]>([]);
const witnesses = ref<Witness[]>([]);
const witnessNames = ref<any>([]);

const statistic = ref({
	totalPledgeNum: '',
	totalPersonPledgeNum: '',
	personalVoteNum: '',
	totalReward: '',
	currentReward: '',
});

const cutDown = ref({
	timer: null,
	end: 0,
	hour: '0',
	min: '0',
	second: '0',
});

const statusBarHeight = ref(0);
const selectType = ref("pledge");


watch(
	() => props.refresh,
	async (newVal) => {
		if (newVal === -1 && cutDown.value.timer) {
			clearTimeout(cutDown.value.timer);
		}

		if (newVal !== -1) {
			await init();
		}
	},
	{ deep: true }
);


onMounted(async () => {
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = (systemInfo.statusBarHeight || 0) + 15;
	await init();
});

//todolist,逻辑？？？
const init = async () => {

};

// 处理资产标签点击
const handleAssetTabClick = (assetActive) => {
	param.value.assetActive = assetActive;

	if (assetActive === 'super') {
		getData(0, 19);
	} else if (assetActive === 'sentry') {
		getData(19, 199);
	} else if (assetActive === 'campaign') {
		getData(199, 1000000);
	}
};

// 获取数据
const getData = (start: number, end: number) => {
	records.value = [];

	for (let i = start; i < end; i++) {
		const rs = witnesses.value[i];
		if (!rs) break;

		const nodeShow = witnessNames.value[rs.address];

		records.value.push({
			node: rs.address,
			nodeShow: nodeShow ? nodeShow.name : ShowUtil.omitAddress(rs.address, 6, 6),
			pledge: rs.voteCount || 0,
			blockNum: rs.latestBlockNum || 0,
		});
	}

	param.value.recordsEmpty = records.value.length === 0;
};

// 页面跳转
const gotoPage = (url: string) => {
	uni.navigateTo({ url });
};

// 控制钱包弹窗显示
const walletPopupshow = (show: boolean) => {
	param.value.show = show;
};

// 倒计时
const countTime = async () => {
	try {
		const now = new Date().getTime();
		const end = cutDown.value.end * 1000;
		let leftTime = end - now;

		let h = 0, m = 0, s = 0;
		if (leftTime >= 0) {
			// 计算时、分、秒
			h = Math.floor((leftTime / 1000 / 60 / 60) % 24);
			m = Math.floor((leftTime / 1000 / 60) % 60);
			s = Math.floor((leftTime / 1000) % 60);

			// 格式化显示
			cutDown.value.hour = h < 10 ? `0${h}` : h.toString();
			cutDown.value.min = m < 10 ? `0${m}` : m.toString();
			cutDown.value.second = s < 10 ? `0${s}` : s.toString();
		}

		// 倒计时结束后重新获取
		if (h === 0 && m === 0 && s === 0) {
			cutDown.value.end = await BitInstance.bitweb.trx.timeUntilNextVoteCycle();
			await countTime();
		} else {
			// 继续倒计时
			cutDown.value.timer = setTimeout(countTime, 1000);
		}
	} catch (e) {
		console.error('倒计时错误:', e);
	}
};

// 改变选择类型
const changeSelectType = (type: string) => {
	selectType.value = type;
};
</script>


<style lang="scss" scoped>
.home-page {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100vw;
	min-height: 100vh;
	padding-left: 31rpx;
	padding-right: 31rpx;
	padding-bottom: 180rpx;
	background-color: #f7f7f7;

	box-sizing: border-box;

	.assetsTypeTab {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 51rpx;
		margin-top: 44rpx;

		// background-color: pink;
		.assetsTypeItem {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: max-content;
			height: 51rpx;

			.assetsTypeText {
				height: 30rpx;
				line-height: 30rpx;
				font-family: PingFang;
				font-weight: bold;
				font-size: 30rpx;
				color: #A2A4B0;
			}

			.activeAssetsTypeText {
				color: #1D1F20 !important;
			}

			.assetsTypeLine {
				width: 63rpx;
				height: 8rpx;
				background-color: #f7f7f7;
				border-radius: 4rpx;
			}

			.activeAssetsTypeLine {
				background: #9D120F !important;
			}
		}
	}

	.dataDetail {
		width: 688rpx;
		height: 253rpx;
		background-image: url('@/static/newUI3/node/dataDetaitBox.png');
		background-size: 100% 100%;
		margin-top: 17rpx;
		padding: 40rpx 40rpx 20rpx 40rpx;
		box-sizing: border-box;

		.header {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 22rpx;

			.assetsName {
				height: 22rpx;
				line-height: 22rpx;
				font-family: PingFang;
				font-weight: 500;
				font-size: 22rpx;
				color: #000000;
			}

			.assetsDetailIcon {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 77rpx;
				height: 22rpx;
				line-height: 22rpx;
				font-family: PingFang;
				font-weight: 500;
				font-size: 22rpx;
				color: #000000;

				.lowerTriangle {
					display: block;
					width: 18rpx;
					height: 12rpx;
				}
			}
		}

		.networkTotal {
			height: 48rpx;
			margin-top: 20rpx;
			line-height: 48rpx;
			font-size: 48rpx;
			color: #fff;
			font-family: PingFang;
			font-weight: 500;
		}

		.personTotal {
			margin-top: 9rpx;
			height: 22rpx;
			line-height: 22rpx;
			font-family: PingFang;
			font-weight: 500;
			font-size: 22rpx;
			color: #000000;

			.personTotalNumber {
				color: #fff;
				margin-left: 10rpx;
				font-family: PingFang;
				font-weight: 500;
				font-size: 22rpx;
				line-height: 22rpx;

			}
		}

		.methodsBox {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 44rpx;
			margin-top: 31rpx;

			.methodsItem {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 142rpx;
				height: 44rpx;
				line-height: 44rpx;
				background: #F6ABA9;
				border-radius: 22rpx;

				font-family: PingFang;
				font-weight: 800;
				font-size: 28rpx;
				color: #1D1F20;
			}

			.activeMethodsItem {
				background: #1D1F20 !important;
				color: #FFFFFF !important;
			}
		}


	}

	.nodeListBox {
		width: 100%;
		height: 876rpx;
		margin-top: 32rpx;
		background: #FFFFFF;
		border-radius: 25rpx;
		padding: 43rpx 34rpx 47rpx 37rpx;
		box-sizing: border-box;

		.header {
			width: 100%;
			height: 51rpx;
			display: flex;

			.nodeTypeList {
				display: flex;
				justify-content: space-between;
				flex: 1;
				height: 51rpx;
				// background-color: pink;

				.nodeType {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width: max-content;
					height: 51rpx;

					.nodeTypeName {
						height: 30rpx;
						line-height: 30rpx;
						font-family: PingFang;
						font-weight: bold;
						font-size: 24rpx;
						color: #A2A4B0;

					}

					.activeNodeTypeName {
						color: #1D1F20;
						font-size: 30rpx !important;
					}

					.nodeTypeLine {
						width: 100%;
						height: 8rpx;
						background-color: #fff;
						border-radius: 4rpx;
					}

					.activeNodeTypeLine {
						background: #9D120F;
					}
				}
			}

			.searchBox {
				display: flex;
				align-items: center;
				width: 136rpx;
				height: 33rpx;
				border-radius: 16rpx;
				border: 1px solid #1D1F20;
				margin-left: 52rpx;
				padding-left: 22rpx;
				box-sizing: border-box;

				.searchIcon {
					display: block;
					width: 19rpx;
					height: 19rpx;
					margin-right: 8rpx;
				}

				.searchText {
					height: 14rpx;
					line-height: 14rpx;
					font-family: PingFang;
					font-weight: 500;
					font-size: 15rpx;
					color: #1D1F20;
				}
			}
		}

		.divider {
			width: 100%;
			height: 1rpx;
			background: #A2A4B0;
		}

		.main {
			width: 100%;
			height: 690rpx;
			// background-color: pink;
			margin-top: 44rpx;

			.tableHeader {
				display: flex;
				width: 100%;
				height: 25rpx;

				// background-color: skyblue;
				.tableHeaderItem {
					flex: 1;
					height: 25rpx;
					text-align: center;
					line-height: 25rpx;
					font-size: 25rpx;
					color: #1D1F20;
					font-family: PingFang;
					font-weight: 700;

				}

				.tableHeaderItem2 {
					flex: 2;
					height: 25rpx;
					line-height: 25rpx;
					text-align: center;
					font-size: 25rpx;
					color: #1D1F20;
					font-family: PingFang;
					font-weight: 700;

				}
			}

			.tableMain {
				display: flex;
				flex-direction: column;
				width: 100%;
				height: 644rpx;
				margin-top: 22rpx;

				overflow-y: auto;

				.nodeItem {
					display: flex;
					width: 100%;
					height: 64rpx;
					border-bottom: 1rpx dashed #A2A4B0;
					box-sizing: border-box;

					.nodeText {
						flex: 1;
						height: 64rpx;
						text-align: center;
						line-height: 64rpx;
						font-size: 22rpx;
						color: #1D1F20;
						font-family: PingFang;
					}

					.nodeText2 {
						flex: 2;
						height: 64rpx;
						text-align: center;
						line-height: 64rpx;
						font-size: 22rpx;
						color: #1D1F20;
						font-family: PingFang;
					}
				}

			}

			.tips {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
				font-size: 22rpx;
				color: #1D1F20;
				font-family: PingFang;

			}
		}


	}
}
</style>