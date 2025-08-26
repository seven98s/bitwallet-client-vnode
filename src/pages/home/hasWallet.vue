 <template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
		<!-- 自定义导航栏 -->
		<navigationBar searchKeyWord='BIT节点计划'></navigationBar>
		<view class="walletBox">
			<view class="walletBoxHeader">
				<view class='left'>
					资产折合
					<text v-show="wallet.type === 2" class="observe">(观察钱包)</text>
				</view>
				<view class='right' @click="gotoPage('../wallet/detail')">
					详情 》
				</view>
			</view>
			<view class="walletPrice" @click="param.show = true">
				{{ wallet.bitNum }}
				<view class="selectCurrencyType">
					<view class="currencyTypeName">BIT</view>
					<image src="@/static/newUI3/index/lowerTriangle.png" mode="scaleToFill" class="lowerTriangle">
					</image>
				</view>
			</view>
			<view class="dollar">
				{{ bitPrice }}
			</view>
			<view class="billMethods">
				<view class="billMethod activeBillMethod" @click="gotoPage('../wallet/transfer/transferWay')">
					转账
				</view>
				<view class="billMethod" @click="gotoPage('../wallet/collect')">
					收款
				</view>
			</view>
		</view>

		<view class="dappList">
			<!-- <view class="dappItem" v-for="(item, index) in dappList" v-if='index < 4 || isShowMoreDapp == true'
				@click="toDapp(item.jumpType, item.jumpUrl)">
				<image :src="item.icon" mode="heightFix" class="dappIcon"></image>
				<view class="dappName">
					{{ item.dappName }}
				</view>
			</view> -->
			<view class="dappItem" v-for="(item, index) in filteredDappList" :key="index"
				@click="toDapp(item.jumpType, item.jumpUrl)">
				<image :src="item.icon" mode="heightFix" class="dappIcon"></image>
				<view class="dappName">
					{{ item.dappName }}
				</view>
			</view>
			<view class="dappItem" @click='showToast'>
				<image src="@/static/newUI3/index/more.png" mode="heightFix" class="dappIcon"></image>
				<view class="dappName">
					更多
				</view>
			</view>
		</view>
		<!-- 我的资产 -->
		<view class="myAssets">
			<view class="header">
				<view class="assetTypeList">
					<view class="assetType" @click="handleAssetTabClick('asset', 0)">
						<view class="assetTypeName" :class="param.assetActive === 'asset' ? 'activeAssetTypeName' : ''">
							资产
						</view>
						<view class="line" :class="param.assetActive === 'asset' ? 'activeLine' : ''">

						</view>
					</view>
					<view class="assetType" @click="handleAssetTabClick('nft', 0)">
						<view class="assetTypeName" :class="param.assetActive === 'nft' ? 'activeAssetTypeName' : ''">
							NFT
						</view>
						<view class="line" :class="param.assetActive === 'nft' ? 'activeLine' : ''">
						</view>
					</view>
					<view class="assetType" v-for="(item, index) in assetsTypeList"
						@click="handleAssetTabClick(item.moduleName, item.id)">
						<view class="assetTypeName"
							:class="param.assetActive === item.moduleName ? 'activeAssetTypeName' : ''">
							{{ item.moduleName }}
						</view>
						<view class="line" :class="param.assetActive === item.moduleName ? 'activeLine' : ''">
						</view>
					</view>
				</view>
				<view class="rightBox">
					<view class="searchBox">
						<image src="@/static/newUI3/index/searchIcon2.png" mode="widthFix" class="searchIcon2"></image>
						<input type="text" placeholder="搜索" v-model="query.tokenName" @confirm="onSearchInput"
							placeholder-class="textareaFont" />
					</view>
				</view>
			</view>

			<!-- 分割线 -->
			<view class="divider"></view>
			<scroll-view class="assetsList" scroll-y="true" @scrolltolower="onScrollToLower">
				<block v-if="showAssets.length > 0">
					<!-- 当资产类型不为assets,或者观察钱包都禁止滑动删除 -->
					<swipeAction v-for="(item, index) in showAssets" :key="index" @delete="handleDelete(item)"
						@contentClick="handleContentClick(item, $event)"
						:disabled="param.assetActive !== 'asset' || wallet.type == 2 || item.tokenType == 'BIT'">
						<view class="assetsItem">
							<image :src="item.icon" mode="widthFix" alt="" class="assetsIcon"
								@error="handleImageError(index)" />
							<view class="accetsName" :class="param.assetActive === 'nft' ? 'accetsName2' : ''">
								{{ item.name }}
							</view>
							<view class="accetsPrice">
								<view class="num">
									{{ item.num }}
								</view>
								<view class="dollarNumber" v-if="item.name == 'BIT'">
									{{ bitPrice }}
								</view>
							</view>
						</view>
					</swipeAction>

					<!-- 资产类型，并且不为观察钱包才能删除 -->
					<view class="assetsItem" @click="gotoPage('/pages/wallet/addToken')"
						v-if="param.assetActive === 'asset' && wallet.type !== 2">
						<image :src=add mode="widthFix" class="assetsIcon">
						</image>
						<view class="accetsName">
							添加新代币
						</view>
					</view>
				</block>
				<block v-else>
					<view class="noMoreData">
						暂无数据
					</view>
				</block>
			</scroll-view>
		</view>

		<!-- 底部tabbar -->
		<walletTabbar :currentIndex='0'></walletTabbar>

		<WalletPopup :show="param.show" url="./index" @walletPopupshow="walletPopupshow"></WalletPopup>
	</view>
</template>

<script setup lang="ts">
import Vue from 'vue';
import navigationBar from '@/components/navigationBar.vue';
import WalletPopup from "@/components/walletPopup.vue";
import Empty from "@/components/empty.vue";
import swipeAction from '@/components/swipeAction.vue'
import { WalletData } from '@/data/wallet/walletData';
// import { BitInstance } from '@/chain/bit/instance';
// import { BitAccount } from '@/chain/bit/account/account';
import { UniUtil } from "@/data/util/uniUtil";
import { CheckUtil } from '@/data/util/checkUtil';
import { RequestUtil } from '@/data/util/requestUtil';


import add from "@/static/newUI3/index/add.png";
import joinNode from "@/static/newUI3/index/joinNode.png";
import dappBrowser from "@/static/newUI3/index/dappBrowser.png";
import incubate from '@/static/newUI3/index/incubate.png';
import transferAccounts from "@/static/newUI3/index/transferAccounts.png"


import { useHttp } from '@/composables/useHttp'

const http = useHttp()

const props = defineProps({
	refresh: {
		type: Number,
		default: 0
	}
});



const statusBarHeight = ref(0);

const bitPrice = ref('');


onMounted(async () => {
	dappList.value = [
		{ dappName: "参与节点", icon: joinNode, jumpType: 0, jumpUrl: '/pages/node/index' },
		{ dappName: "DApp浏览器", icon: dappBrowser, jumpType: 0, jumpUrl: '/pages/explore/index' },
		{ dappName: "一键孵化", icon: incubate, jumpType: 1, jumpUrl: '' },
		{ dappName: "跨链转币", icon: transferAccounts, jumpType: 1, jumpUrl: 'http://crosschain.bitnetworkbc.com' },
	];

	// 设置账户地址
	const { address } = WalletData.account;
	query.account = address;

	// 获取状态栏高度
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = (systemInfo.statusBarHeight || 0) + 15;

	// 初始化数据
	await init();
	getAssetsTypeList();
});



const init = async () => {
	UniUtil.loadShow();
	getAccount();
	assets.value = [];
	showAssets.value = [];
	query.pageNo = 1;
	if (param.assetActive === 'asset') {
		query.tokenType = ["BIT", "BRC10", "BRC20"];
		query.addFlag = true;
		await getAssets();
	} else if (param.assetActive === 'nft') {
		query.tokenType = ["BRC721", "BRC1155"];
		query.addFlag = false;
		await getAssets();
	} else {
		assets.value = [];
		showAssets.value = [];
		query.addFlag = false;
		query.tokenType = [];
		query.pageNo = 1;
		await getAssets2();
	}
	try {
		// 获取BIT价格
		const bitPriceRs = await RequestUtil.get('https://api.bidacoin.co/api/v0/markets/publicapi/ticker?market=BITUSDT') as any;
		bitPrice.value = bitPriceRs.data.data == null ? '≈$- - - -' : '≈$' + bitPriceRs.data.data * wallet.bitNum;
	} catch {
		bitPrice.value = '≈$- - - -';
		UniUtil.loadHide();
	}

}




const getAssetsTypeList = async () => {
	try {
		const res = await http({
			url: "/app/moduleconfig/list",
			method: 'POST',
		})
		if (res.length > 0) {
			assetsTypeList.value = res
		}
	} catch {
		UniUtil.toastError('加载失败，请刷新重试');
	}

}



watch(
	() => props.refresh,
	async (newval) => {
		if (newval !== -1) {
			await init()
		}
	},
	{deep: true}
	
)



const wallet = reactive({
	name: '',
	bitNum: 0,
	address: '',
	type: 0,
});

const param = reactive({
	assetActive: 'asset',
	show: false,
	search: '',
});



interface DappItem {
	dappName: string,
	icon: any,
	jumpType: number,//0:跳转app内部页面跳转，1:跳转外部，webservice
	jumpUrl: string,
}
const dappList = ref<DappItem[]>([])
const filteredDappList = computed(() => {
	return dappList.value.filter((_, index) => index < 4 || isShowMoreDapp.value);
});

const isShowMoreDapp = ref(false);

const toDapp = (type: number, url: string) => {
	if (!(url.length > 0)) {
		return showToast();
	}
	if (type == 0) {
		uni.switchTab({
			url: url
		})
	}

}

const showToast = () => {
	uni.showToast({
		title: `功能待定`, // 提示的内容
		icon: 'none', // 图标，有效值 'success'、'loading'、'none'
		duration: 2000, // 提示的延迟时间，单位毫秒，默认 1500
		mask: false // 是否显示透明蒙层，防止触摸穿透，默认 false
	})
}


const gotoPage = (url: string) => {
	uni.navigateTo({ url });
};


interface AssetItem {
	icon: any;
	address: string;
	name: string;
	num: number;
	tokenType: string;
	recordId: number;
	tokenAddress: string;
}
const assets = ref<AssetItem[]>([])


const showAssets = ref<AssetItem[]>([])

interface QueryParams {
	account: string;
	moduleId: number;
	pageNo: number;
	pageSize: number;
	addFlag: boolean;
	tokenName: string;
	tokenType: string[];
}
const query = reactive<QueryParams>({
	account: "",
	moduleId: 0,
	pageNo: 1,
	pageSize: 10,
	addFlag: true,
	tokenName: "",
	tokenType: []
});

const total = ref(0)


const getAssets = async () => {
	try {
		const res = await http({
			url: "/app/accounttoken/page",
			method: 'POST',
			data: query
		})

		let datas = res.list;
		total.value = res.total;
		datas.map((data: any) => {
			if (data.tokenType === 'BIT') {
				wallet.bitNum = data.blance;
			}
			const icon = `http://dappimage.bitnetworkbc.com/tokenIcon/${data.tokenName}.png`;
			const assetItem: AssetItem = {
				icon,
				address: data.tokenAddress,
				name: data.tokenName,
				num: data.balance,
				tokenType: data.tokenType,
				recordId: data.recordId,
				tokenAddress: data.tokenAddress,
			};

			assets.value.push(assetItem);
			showAssets.value.push(assetItem);
		});

	} catch (e) {
		if (query.pageNo > 1) query.pageNo--;
		UniUtil.toastError('加载失败，请刷新重试');
	}
}





const handleAssetTabClick = async (assetActive: string, moduleId: number) => {
	param.assetActive = assetActive;
	if (assetActive === 'asset') {
		assets.value = [];
		showAssets.value = [];
		query.addFlag = true;
		query.tokenType = ["BIT", "BRC10", "BRC20"];
		query.pageNo = 1
		query.moduleId = moduleId

	} else if (assetActive === 'nft') {
		assets.value = [];
		showAssets.value = [];
		query.addFlag = false;
		query.tokenType = ["BRC721", "BRC1155"];
		query.pageNo = 1
		query.moduleId = moduleId
		await getAssets();
	}
}



const assetsTypeList = ref<any[]>([]);

const getAssets2 = async () => {
	try {
		const res = await http({
			url: "/app/moduletoken/page",
			method: 'POST',
			data: query
		})
		let datas = res.list
		total.value = res.total
		datas.map((data: any) => {
			const icon = `http://dappimage.bitnetworkbc.com/tokenIcon/${data.tokenName}.png`;
			const assetItem: AssetItem = {
				icon,
				address: data.tokenAddress,
				name: data.tokenName,
				num: data.balance,
				tokenType: data.tokenType,
				recordId: data.recordId,
				tokenAddress: data.tokenAddress,
			};

			assets.value.push(assetItem);
			showAssets.value.push(assetItem);
		})
	} catch {
		if (query.pageNo > 1) query.pageNo--
		UniUtil.toastError('加载失败，请刷新重试');
	}
}

const onSearchInput = async () => {
	if (param.assetActive === 'asset') {
		assets.value = []
		showAssets.value = []
		query.addFlag = true
		query.tokenType = ["BIT", "BRC10", "BRC20"]
		query.pageNo = 1
		await getAssets();
	} else if (param.assetActive === 'nft') {
		assets.value = []
		showAssets.value = []
		query.addFlag = false
		query.tokenType = ["BRC721", "BRC1155"]
		query.pageNo = 1
		await getAssets();
	} else {
		assets.value = []
		showAssets.value = []
		await getAssets2();

	}
}

const onScrollToLower = () => {
	if (assets.value.length >= total.value) {
		uni.showToast({
			title: '没有更多数据了',
			icon: 'none',
			duration: 2000,
			mask: false
		});
	} else if (param.assetActive === 'asset') {
		query.tokenType = ["BIT", "BRC10", "BRC20"];
		query.addFlag = true;
		query.pageNo++;
		getAssets();
	} else if (param.assetActive === 'nft') {
		query.tokenType = ["BRC721", "BRC1155"];
		query.addFlag = false;
		query.pageNo++;
		getAssets();
	}
};

const handleDelete = (item: AssetItem) => {
	if (item.tokenType == 'BIT') {
		return UniUtil.toastError('BIT代币不能删除');
	};
	http({
		url: "/app/accounttoken/delete",
		method: 'POST',
		data: {
			account: wallet.address,
			recordId: item.recordId,
			tokenAddress: item.tokenAddress
		}
	}).then(() => {
		UniUtil.toastSuccess('删除成功');
		query.pageNo = 1;
		showAssets.value = [];
		assets.value = [];
		getAssets();
	}).catch(() => {
		UniUtil.toastError('删除失败');
	});
};

const handleContentClick = (item: AssetItem, e: any) => {
	gotoPage(`../wallet/tokenDetail?address=${item.address}&name=${item.name}&tokenType=${item.tokenType}`);

};

import bit from "@/static/token/icon/bit.png"
const handleImageError = (index: number) => {
	showAssets[index].icon = bit;
}

const walletPopupshow = (show: boolean) => {
	param.show = show;
}

const getAccount = () => {
	const account = WalletData.account;
	wallet.name = account.name;
	wallet.address = account.address;
	wallet.type = account.type;
}
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
	padding-bottom: 154rpx;
	box-sizing: border-box;
	// background-color: #FFFFFF;
	background-color: #f7f7f7;
	background-image: url('@/static/newUI3/index/index2.png');
	background-size: 100%;
	background-repeat: no-repeat;
	box-sizing: border-box;


	.walletBox {
		width: 688rpx;
		height: 253rpx;
		margin-top: 25rpx;
		background-image: url('@/static/newUI3/index/walletBox.png');
		background-size: 100% 100%;
		padding: 39rpx 40rpx 21rpx 40rpx;
		box-sizing: border-box;

		.walletBoxHeader {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 21rpx;

			.left {
				font-family: PingFang;
				font-weight: 500;
				font-size: 21rpx;
				line-height: 21rpx;
				color: #000000;

				.observe {
					margin-left: 10rpx;
					font-family: PingFang;
					font-weight: 500;
					font-size: 21rpx;
					line-height: 21rpx;
					color: #000000;
				}
			}

			.right {
				font-family: PingFang;
				font-weight: 500;
				font-size: 21rpx;
				line-height: 21rpx;
				color: #FFFFFF;
			}
		}

		.walletPrice {
			display: flex;
			// align-items: center;
			height: 48rpx;
			font-size: 48rpx;
			line-height: 48rpx;
			color: #FFFFFF;
			margin-top: 20rpx;
			font-family: PingFang;

			.selectCurrencyType {
				display: flex;
				align-items: center;
				height: 22rpx;
				font-family: PingFang;
				font-weight: 500;
				font-size: 22rpx;
				line-height: 22rpx;
				color: #000000;
				margin-left: 16rpx;
				margin-top: 20rpx;

				// background-color: pink;
				.lowerTriangle {
					display: block;
					width: 18rpx;
					height: 12rpx;
					margin-left: 9rpx;
					vertical-align: middle;
				}
			}
		}

	}

	.dollar {
		margin-top: 10rpx;
		height: 20rpx;
		font-family: PingFang;
		font-weight: 500;
		font-size: 20rpx;
		line-height: 20rpx;
		color: #000000;

	}

	.billMethods {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 44rpx;
		margin-top: 31rpx;

		.billMethod {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 247rpx;
			height: 44rpx;

			background: #F6ABA9;
			border-radius: 22rpx;
			box-sizing: border-box;

			font-family: PingFang;
			font-weight: 800;
			font-size: 28rpx;
			color: #1D1F20;
		}

		.activeBillMethod {
			color: #FFFFFF;
			background: #1D1F20 !important;
		}
	}

	.dappList {
		display: flex;
		// justify-content: space-between;
		width: 100%;
		height: 90rpx;
		margin-top: 43rpx;
		overflow-x: auto;
		// ps
		// background-color: skyblue;

		.dappItem {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-direction: column;
			width: max-content;
			min-width: max-content;
			margin-right: 59rpx;
			height: 90rpx;

			.dappIcon {
				display: block;
				height: 46rpx;
			}

			.dappName {
				font-family: PingFang;
				font-weight: 500;
				font-size: 22rpx;
				color: #000000;
			}
		}

		& .dappItem:last-child {
			margin-right: 0rpx;
		}
	}

	.myAssets {
		margin-top: 31rpx;
		width: 688rpx;
		// height: 881rpx;
		background: #FFFFFF;
		border-radius: 25rpx;
		padding: 51rpx 31rpx 51rpx 40rpx;
		box-sizing: border-box;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 54rpx;
			border-bottom: 2rpx solid #A2A4B0;
			box-sizing: border-box;

			.assetTypeList {
				display: flex;
				width: 80%;
				overflow-x: auto;

				.assetType {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					// min-width: 62rpx;
					height: 52rpx;
					margin-right: 27rpx;



					.assetTypeName {
						// width: 62rpx;
						width: max-content;
						height: 30rpx;
						font-family: PingFang;
						font-weight: bold;
						font-size: 30rpx;
						color: #A2A4B0;
					}

					.activeAssetTypeName {
						color: #1D1F20 !important;
					}

					.line {
						height: 8rpx;
						background: #FFFFFF;
						border-radius: 4rpx;
					}

					.activeLine {
						background: #E80502 !important;
					}
				}
			}

			.rightBox {
				display: flex;
				width: 136rpx;
				height: 34rpx;

				.searchBox {
					display: flex;
					align-items: center;
					width: 136rpx;
					height: 34rpx;
					border-radius: 16rpx;
					border: 1px solid #A2A4B0;
					padding-left: 16rpx;
					box-sizing: border-box;

					.searchIcon2 {
						display: block;
						width: 19rpx;
						height: 19rpx;
						margin-right: 8rpx;
					}

					input {
						padding: 0rpx;
						flex: 1;
						height: 32rpx;
						font-size: 20rpx;
					}

				}
			}
		}

		.assetsList {
			margin-top: 2rpx;
			height: 43vh;
			overflow-y: auto;

			.assetsItem {
				display: flex;
				align-items: center;
				width: 100%;
				height: 146rpx;
				border-bottom: 1px dashed #ccc;
				box-sizing: border-box;

				.assetsIcon {
					display: block;
					width: 69rpx;
					height: 69rpx;
					margin-right: 17rpx;
				}

				.accetsName {
					width: 140rpx;
					height: 27rpx;
					font-family: PingFang;
					font-weight: 800;
					font-size: 27rpx;
					line-height: 27rpx;
					color: #A2A4B0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.accetsName2 {
					width: 250rpx !important;

				}

				.accetsPrice {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-between;
					flex: 1;


					.num {
						width: 100%;
						height: 34rpx;
						line-height: 34rpx;
						font-family: PingFang;
						font-weight: 800;
						font-size: 34rpx;
						color: #1D1F20;
						text-align: end;
					}

					.dollarNumber {
						width: 100%;
						height: 22rpx;
						line-height: 22rpx;
						font-family: PingFang;
						font-size: 22rpx;
						color: #A2A4B0;
						text-align: end;
					}

				}
			}

			&.assetsItem:last-child {
				border: 0rpx;
			}

		}

		@media(max-height:667px) {
			.assetsList {
				height: 33vh;
			}
		}
	}

}

.textareaFont {
	font-family: PingFang;
	font-weight: 500;
	font-size: 20rpx;
	color: #1D1F20;
}

.noMoreData {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	text-align: center;
	font-family: PingFang;
	font-weight: 500;
	font-size: 25rpx;
	color: #A2A4B0;
	line-height: 25rpx;
}
</style>