<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='Token详情'></titleBar>
		<view class="tokenBox">
			<image :src="tokenIcon" mode="aspectFill" class="tokenIcon" @error="handleImageIconError"></image>
			<view class="tokenName">
				{{ query.name }}
			</view>
		</view>
		<view class="myAssets" v-if="query.tokenType == 'BRC721' || query.tokenType == 'BRC1155'">
			<view class="header">
				<view class="left">
					<view class="title">
						资产
					</view>
					<view class="underLine">

					</view>
				</view>
				<view class="searchBox">
					<image src="@/static/newUI3/index/searchIcon2.png" mode="widthFix" class="searchIcon"></image>
					<input type="text" placeholder="搜索" v-model="param.search" @input="onSearchInput"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="divider">
			</view>
			<view class="nftList">
				<block v-if="brc1155Records.length>0">
					<view class="nftItem" v-for="(item, index) in brc1155Records" :key="item.id">
						<image :src="brc1155Uri+item.nftId+'.png'" @error="handleImageNftError(index)" mode="aspectFill"
							class="nftIcon"></image>
						<view class="nftId">
							{{item.nftId}}
						</view>
					</view>
				</block>
				<block v-else>
					<view class="noMoreData">
						暂无数据
					</view>
				</block>
			</view>
		</view>

		<view class="titleBox">
			资产往来记录
		</view>
		<!-- <view class="recordBox">
			<view class="recordHeader">
				<view class="recordHeaderItem">转出</view>
				<view class="recordHeaderItem">转入</view>
				<view class="recordHeaderItem" v-if="query.tokenType == 'BRC721' || query.tokenType == 'BRC1155'">编号
				</view>
				<view class="recordHeaderItem">数量</view>
			</view>
			<view class="recordList">
				<block v-if="records.length>0">
					<view class="recordItem" v-for="(item,index) in records" :key="index"
						@click="gotoPage('./txDetail?txHash='+item.txHash+'&to='+item.to)">
						<view class="recordText">{{ item.from }}</view>
						<view class="recordText">{{ item.toShow }}</view>
						<view class="recordText" v-if="query.tokenType == 'BRC721' || query.tokenType == 'BRC1155'">
							{{ item.nftId }}
						</view>
						<view class="recordText">{{ item.num }}</view>
					</view>
				</block>
				<block v-else>
					<view class='noMoreData'>暂无数据</view>
				</block>
			</view>
		</view> -->
		<view class="recordBox">
			<view class="recordHeader">
				<view class="transferType" @click="changeTransferType(0)">
					<view class='transferTypeName' :class="transferType==0?'activeTransferTypeName':''">全部</view>
					<view class="underLine" :class="transferType==0?'activeUnderLine':''"></view>
				</view>
				<view class="transferType" @click="changeTransferType(1)">
					<view class='transferTypeName' :class="transferType==1?'activeTransferTypeName':''">转账</view>
					<view class="underLine" :class="transferType==1?'activeUnderLine':''"></view>
				</view>
				<view class="transferType" @click="changeTransferType(2)">
					<view class='transferTypeName' :class="transferType==2?'activeTransferTypeName':''">收款</view>
					<view class="underLine" :class="transferType==2?'activeUnderLine':''"></view>
				</view>
			</view>
			<view class="recordListBox">
				<view class="recordListHeader">
					<view class="recordListHeaderItem">
						时间
					</view>
					<view class="recordListHeaderItem">
						转账地址
					</view>
					<view class="recordListHeaderItem">
						收款地址
					</view>
					<view class="recordListHeaderItem "
						v-if="query.tokenType == 'BRC721' || query.tokenType == 'BRC1155'">
						编号
					</view>
					<view class="recordListHeaderItem"
						v-if="query.tokenType == 'BRC721' || query.tokenType == 'BRC1155'">
						数量
					</view>
					<view class="recordListHeaderItem" v-else>
						金额
					</view>
				</view>
				<view class="recordListMain">
					
					<block v-if="records.length>0">
					<view class="recordItem" v-for="(item,index) in records" :key="index"
						@click="gotoPage('./txDetail?txHash='+item.txHash+'&to='+item.to)" >
						<view class="recordText">
							{{item.time}}
						</view>
						<view class="recordText">
							{{ item.fromShow }}
							<image src="@/static/newUI3/transaction/copy.png" class='copyIcon'
								@click.stop="copy(item.from)"></image>
						</view>
						<view class="recordText">{{ item.toShow }}
							<image src="@/static/newUI3/transaction/copy.png" class='copyIcon'
								@click.stop="copy(item.to)"></image>
						</view>
						<view class="recordText"
							v-if="query.tokenType == 'BRC721' || query.tokenType == 'BRC1155'">
							{{ item.nftId }}
						</view>
						<view class="recordText">{{item.to==myAddress?'+':'-'}} {{ item.num }}</view>
					</view>
					</block>
					<block v-else>
						<view class='noMoreData'>暂无数据</view>
					</block>
				</view>
			</view>

		</view>
		<view class="buttonList">
			<view class="button"
				@click="gotoPage(query.address == 'BIT' ? './transfer/transferWay' : './transfer/transfer?tokenAddress='+query.address)">
				发送
			</view>
			<view class="button button2" @click="gotoPage('./collect')">
				接收
			</view>
		</view>
	</view>

</template>

<script lang="ts">
	import Vue from 'vue';
	import Empty from "@/components/empty.vue";
	import { BitInstance } from '@/chain/bit/instance';
	import { UniUtil } from "@/data/util/uniUtil";
	import { Frozen, Witness } from 'bitweb-ts/lib/esm/types/Trx';
	import { ShowUtil } from '@/data/util/showUtil';
	import { CheckUtil } from '@/data/util/checkUtil';
	import { BitAccount } from '@/chain/bit/account/account';
	import { WalletData } from '@/data/wallet/walletData';

	export default Vue.extend({
		components: { Empty },
		data() {
			return {
				param: {
					recordsEmpty: false,
					nftsEmpty: false,
					search: '',
				},
				query: {
					name: '',
					address: '',
					tokenType: '',
					page: 1,
					pageSize: 500,
					from: '',
					to: ''
				},
				records: new Array<{
					txHash : string;
					from : string;
					fromShow : string;
					to : string;
					toShow : string;
					nftId : string;
					num : number;
					time : string;
				}>(),
				brc1155Records: new Array<any>(),
				brc1155Uri: "",
				tokenIcon: "",
				statusBarHeight: 0,
				transferType: 0,//0,1,2 全部，转入，转出
				myAddress: ''
			}
		},
		async onShow() {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			await this.init();
		},
		async onLoad(query : any) {
			this.myAddress = WalletData.account.address
			this.query.name = query.name;
			this.query.address = query.address;
			this.query.tokenType = query.tokenType;


			// 查询token类型
			const tokenInfo : any = await BitAccount.getTokenInfo(this.query.address);
			this.query.tokenType = tokenInfo.token?.tokenType;

			const icon = "http://dappimage.bitnetworkbc.com/tokenIcon/" + this.query.name + ".png";
			// let icon = require('@/static/token/icon/bit.png');
			// if(this.query.address == 'B5B6XMXe34nXcwT4YRDrxgMhFJQxT6sPwK') {
			// 	icon = require('@/static/token/icon/usdt.png');
			// }
			// if(this.query.address == 'BPECUqRpzG5LkmkHLjViqAbiyjs6icWoER') {
			// 	icon = require('@/static/token/icon/htc.png');
			// }

			// if(this.query.tokenType == 'BRC1155') {
			// 	icon = require('@/static/token/icon/nft.png');
			// }
			this.tokenIcon = icon;
		},
		methods: {
			handleImageIconError() {
				this.tokenIcon = require('@/static/token/icon/bit.png');
			},
			handleImageNftError(index : number) {
				// this.brc1155Records[index] = require('@/static/token/icon/bit.png');
				if (this.query.tokenType == 'BRC721' && (this.brc1155Uri.startsWith('http://47.236.254.203:6018'))) {
					this.brc1155Records[index] = this.brc1155Uri + '1.png';
				}
			},
			async init() {
				UniUtil.loadShow();
				this.records = new Array<{
					txHash : string;
					from : string;
					fromShow : string
					to : string;
					toShow : string;
					nftId : string;
					num : number;
					time : string;
				}>();

				await BitAccount.getTransfers3(WalletData.account.address, this.query.address, this.query.page, this.query.pageSize, this.query.from, this.query.to).then((rs : any) => {
					const datas = rs.data;

					datas.map((data : any) => {
						this.records.push({
							txHash: data.transactionId,
							fromShow: ShowUtil.omitAddress(data.from, 3, 3),
							from: data.from,
							to: data.to,
							toShow: ShowUtil.omitAddress(data.to, 3, 3),
							nftId: data.nftId,
							num: data.value,
							time: data.createTime,
						})
					});
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('加载失败，请刷新重试');
				});

				this.param.recordsEmpty = this.records.length == 0;

				this.brc1155Records = new Array<any>();

				if (this.query.tokenType == 'BRC721' || this.query.tokenType == 'BRC1155') {
					// 获取通证信息
					const tokenInfo : any = await BitAccount.getTokenInfo(this.query.address);
					this.brc1155Uri = tokenInfo.token.token1155Param.uri;

					// 查询当前用户所有的1155通证
					await BitAccount.getToken1155Transfers(WalletData.account.address, this.query.address, 1, 200).then((rs : any) => {
						const datas = rs.data;

						datas.map((data : any) => {
							this.brc1155Records.push({
								...data,
							})
						});
					}).catch((e : any) => {
						console.log(e);
						UniUtil.toastError('加载失败，请刷新重试');
					});

					this.param.nftsEmpty = this.brc1155Records.length == 0;
				}

				UniUtil.loadHide();
			},
			async onSearchInput() {
				this.brc1155Records = new Array<any>();

				// 查询当前用户所有的1155通证
				await BitAccount.getToken1155Transfers(WalletData.account.address, this.query.address, 1, 100, this.param.search).then((rs : any) => {
					const datas = rs.data;

					datas.map((data : any) => {
						this.brc1155Records.push({
							...data,
						})
					});
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('加载失败，请刷新重试');
				});

				this.param.nftsEmpty = this.brc1155Records.length == 0;
			},
			gotoPage(url : string) {
				uni.navigateTo({
					url
				})
			},
			changeTransferType(type : number) {
				this.transferType = type
				if (type == 0) {
					this.query.page = 1
					this.query.from = ''
					this.query.to = ''
				} else if (type == 1) {
					this.query.page = 1
					this.query.from = WalletData.account.address
					this.query.to = ''
				} else if (type == 2) {
					this.query.page = 1
					this.query.from = ''
					this.query.to = WalletData.account.address
				}
				this.init()
			},
			copy(value : string) {
				UniUtil.copy(value);
			},
		}
	});
</script>


<style lang="scss" scoped>
	.home-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		min-height: 100vh;
		padding: 0rpx 31rpx 31rpx 20rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.tokenBox {
			display: flex;
			align-items: center;
			margin-top: 59rpx;
			width: 100%;
			height: 123rpx;
			background: #fff;
			border-radius: 25rpx;
			padding: 24rpx 31rpx;
			box-sizing: border-box;

			.tokenIcon {
				display: block;
				width: 75rpx;
				height: 75rpx;
				margin-right: 19rpx;
			}

			.tokenName {
				height: 29rpx;
				font-family: PingFang;
				font-weight: bold;
				font-size: 29rpx;
				color: #231815;
				line-height: 29rpx;
			}
		}

		.myAssets {
			margin-top: 20rpx;
			width: 688rpx;
			height: 429rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			padding: 52rpx 38rpx 38rpx 38rpx;
			box-sizing: border-box;

			.header {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 48rpx;

				// background-color: pink;
				.left {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 48rpx;

					.title {
						height: 25rpx;
						line-height: 25rpx;
						font-family: PingFang;
						font-weight: bold;
						font-size: 25rpx;
						color: #1D1F20;
					}

					.underLine {
						height: 8rpx;
						background: #E80502;
						border-radius: 4rpx;
					}
				}


				.searchBox {
					display: flex;
					align-items: center;
					width: 136rpx;
					height: 33rpx;
					border-radius: 16rpx;
					border: 1px solid #A2A4B0;
					padding-left: 16rpx;
					box-sizing: border-box;

					.searchIcon {
						display: block;
						width: 19rpx;
						height: 19rpx;
						margin-right: 8rpx;
					}

					input {
						padding: 0rpx;
						flex: 1;
						height: 33rpx;
						box-sizing: border-box;
						font-size: 20rpx;
					}

				}

			}

			.divider {
				width: 100%;
				height: 1rpx;
				background-color: #A2A4B0;
			}

			.nftList {
				display: flex;
				flex-wrap: wrap;
				overflow-y: auto;
				width: 100%;
				height: 232rpx;
				margin-top: 48rpx;

				.nftItem {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width: 69rpx;
					height: 106rpx;
					margin-right: 10rpx;
					margin-bottom: 20rpx;
					// background-color: skyblue;

					.nftIcon {
						display: block;
						width: 69rpx;
						height: 69rpx;
					}

					.nftId {
						min-height: 17rpx;
						text-align: center;
						font-family: PingFang;
						font-weight: 500;
						font-size: 17rpx;
						color: #838383;
						line-height: 17rpx;
						word-break: break-all;
					}
				}
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
			height: 818rpx;
			background: #FFFFFF;
			border-radius: 25rpx;
			padding: 40rpx 20rpx 20rpx 20rpx;
			box-sizing: border-box;

			.recordHeader {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 56rpx;
				border-bottom: 2rpx solid #e6e6e6;
				box-sizing: border-box;

				.transferType {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					width: 129rpx;
					height: 54rpx;

					.transferTypeName {
						width: 56rpx;
						height: 28rpx;
						font-family: PingFang;
						font-size: 28rpx;
						color: #A2A4B0;
						line-height: 28rpx;
					}

					.activeTransferTypeName {

						font-weight: bold !important;
						color: #1D1F20 !important;
					}

					.underLine {
						width: 56rpx;
						height: 8rpx;
						border-radius: 4rpx;
						background-color: #fff;
					}

					.activeUnderLine {
						background: #E80502 !important;
					}
				}
			}

			.recordListBox {
				width: 100%;
				height: 724rpx;
				overflow-y: auto;
				box-sizing: border-box;

				.recordListHeader {
					margin-top: 20rpx;
					display: flex;
					justify-content: space-between;
					min-width: 100%;
					height: 24rpx;

					.recordListHeaderItem {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 129rpx;
						height: 24rpx;
						font-family: PingFang;
						font-size: 24rpx;
						color: #8c8c8c;
						line-height: 24rpx;
					}
				}

				.recordListMain {
					margin-top: 10rpx;
					width: 100%;
					height: 660rpx;
					overflow-y: auto;
					// ps
					// background-color: skyblue;

					.recordItem {
						display: flex;
						justify-content: space-between;
						width: 100%;
						height: 96rpx;
						border-bottom: 1rpx dashed #e6e6e6;
						box-sizing: border-box;

						.recordText {
							margin-right: 0rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							width: 129rpx;
							height: 95rpx;

							font-size: 24rpx;
							color: #8b8b8b;
							text-align: center;

							font-family: XiQuejuzhenti-regular;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
							text-overflow: ellipsis;
							word-break: break-all;

							.copyIcon {
								display: block;
								width: 25rpx;
								height: 27rpx;
								margin-left: 10rpx;
							}
						}
						& .recordText:last-child {
							margin-right: 0rpx;
						}


					}
				}

			}
		}
		.buttonList {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 79rpx;
			margin-top: 49rpx;

			// background-color: skyblue;
			.button {
				display: flex;
				align-items: center;
				justify-content: center;

				width: 308rpx;
				height: 79rpx;
				background: #838383;
				border-radius: 39rpx;

				font-family: PingFang;
				font-weight: 800;
				font-size: 28rpx;
				color: #FFFFFF;
			}

			.button2 {
				background: #1D1F20 !important;
			}
		}
	}

	.textareaFont {
		font-family: PingFang;
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