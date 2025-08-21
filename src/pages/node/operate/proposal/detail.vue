<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px'}">
		<titleBar title='提案详情'></titleBar>
		<view class="paramsList">
			<view class="params">
				<view class="title">
					提案编号
				</view>
				<view class="inputBox">
					<input type="text" v-model="show.noShow" readonly disabled="true"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="params">
				<view class="title">
					提议者
				</view>
				<view class="inputBox">
					<input type="text" v-model="show.proposer" readonly disabled="true"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="params">
				<view class="title">
					内容
				</view>
				<view class="textareaBox">
					<textarea type="text" v-model="show.content" readonly disabled="true"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="params">
				<view class="title">
					创建时间
				</view>
				<view class="inputBox">
					<input type="text" v-model="show.startTime" readonly disabled="true"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="params">
				<view class="title">
					失效时间
				</view>
				<view class="inputBox">
					<input type="text" v-model="show.endTime" readonly disabled="true"
						placeholder-class="textareaFont" />
				</view>
			</view>
			<view class="params">
				<view class="title">
					投票情况
				</view>
				<view class="inputBox">
					<input type="text" v-model="show.approveStr" readonly disabled="true"
						placeholder-class="textareaFont" />
				</view>
			</view>
		</view>
		<view class="buttonList">
			<view class="button" @click="confirm(false)">否决</view>
			<view class="button agree"  @click="confirm(true)">同意</view>
		</view>
		<PasswordPopup></PasswordPopup>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';
	import TermAndPrivacy from "@/components/termAndPrivacy.vue";
	import PasswordPopup from "@/components/password/passwordPopup.vue";
	import { BitInstance } from '@/chain/bit/instance';
	import { BitAccount } from '@/chain/bit/account/account';
	import { CheckUtil } from '@/data/util/checkUtil';
	import { UniUtil } from '@/data/util/uniUtil';
	import { WalletData } from '@/data/wallet/walletData';
	import { PROPOSAL_MAP } from '@/data/constants';
	import { ChainParameter, Proposal } from 'bitweb-ts/lib/esm/types/Trx';
	import { TimeUtil } from "@/data/util/timeUtil";

	export default Vue.extend({
		components: { PasswordPopup },
		data() {
			return {
				show: {
					no: '',
					noShow: '',
					proposer: '',
					content: '',
					startTime: '',
					endTime: '',
					approveStr: '',
					approvals: 0,
					total: 0,
					status: '',
				},
				statusBarHeight: 0,
			}
		},
		async onLoad(query : any) {
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight! + 15;
			UniUtil.loadShow();
			this.show.no = query.id;
			this.show.noShow = "#" + this.show.no;

			this.show.total = (await BitInstance.bitweb.trx.listSuperRepresentatives()).length;

			await BitInstance.bitweb.trx.listProposals().then((proposals : any) => {
				proposals.map((proposal : any) => {
					if (proposal.proposal_id == this.show.no) {
						const proposer = BitInstance.bitweb.address.fromHex(proposal.proposer_address);
						this.show.proposer = proposer;

						let tip = "";
						PROPOSAL_MAP.map((proposalData : any) => {
							if (proposalData.no === proposal.parameters[0].key) {
								tip = proposalData.describe;
							}
						})
						this.show.content = tip + "变更为" + proposal.parameters[0].value;


						this.show.startTime = TimeUtil.timestampToDate(proposal.create_time);
						this.show.endTime = TimeUtil.timestampToDate(proposal.expiration_time);

						this.show.approvals = proposal.approvals === undefined ? 0 : proposal.approvals.length;
						this.show.approveStr = this.show.approvals + '/' + this.show.total;

						this.show.status = proposal.state;
					}
				})
			});
			UniUtil.loadHide();
		},
		methods: {
			async confirm(type : boolean) {

				if (this.show.status === "APPROVED") {
					UniUtil.toastError("提案已通过，无法投票");
					return;
				}

				UniUtil.loadShow();

				await BitInstance.bitweb.transactionBuilder.voteProposal(parseInt(this.show.no), type, WalletData.account.address).then(async (rs : any) => {
					// console.log(rs)
					const sign = await BitInstance.bitweb.trx.sign(rs);
					// console.log(sign)
					await BitInstance.bitweb.trx.sendRawTransaction(sign).then((voteRs : any) => {
						console.log(voteRs)
						if (voteRs.result) {
							UniUtil.toastSuccess('投票提案交易发送成功', () => {
								setTimeout(() => {
									uni.redirectTo({
										url: './page'
									});
								}, 1000);
							});
						} else {
							UniUtil.toastError('投票提案交易发送失败，请重试');
						}
					}).catch((e : any) => {
						// console.log(e);
						UniUtil.toastError('投票提案交易发送失败');
					});
				}).catch((e : any) => {
					console.log(e);
					UniUtil.toastError('投票提案交易发送失败');
				});

				UniUtil.loadHide();
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
		padding: 0rpx 31rpx;
		box-sizing: border-box;
		background-color: #f7f7f7;
		background-size: 100% 100%;
		box-sizing: border-box;

		.paramsList {
			width: 100%;
			// height: 800rpx;
			border-radius: 20rpx;
			margin-top: 49rpx;
			padding: 36rpx;
			box-sizing: border-box;
			background-color: #fff;

			.params {
				margin-bottom: 44rpx;

				.title {
					width: 100%;
					height: 26rpx;
					font-family: PingFang;
					font-weight: bold;
					font-size: 26rpx;
					color: #1D1F20;
					line-height: 26rpx;
					box-sizing: border-box;
				}

				.inputBox {
					width: 100%;
					height: 79rpx;
					background: #f7f7f7;
					border-radius: 39rpx;
					margin-top: 39rpx;

					input {
						width: 100%;
						height: 100%;
						padding-left: 36rpx;
						box-sizing: border-box;
						
						font-family: PingFang;
						font-weight: 500;
						font-size: 25rpx;
						color: #838383;
					}
				}

				.textareaBox {
					margin-top: 31rpx;
					width: 100%;
					height: 247rpx;
					background: #f7f7f7;
					border-radius: 25rpx;

					textarea {
						width: 100%;
						height: 100%;
						padding: 28rpx 36rpx;
						box-sizing: border-box;
						
						font-family: PingFang;
						font-weight: 500;
						font-size: 25rpx;
						color: #838383;
					}
				}


			}


		}
		.buttonList {
			display: flex;
			justify-content: space-around;
			width: 100%;
			height: 79rpx;
			border-radius: 39rpx;
			margin-top: 20rpx;
			.button {
				display: flex;
				align-items: center;
				justify-content: center;
				
				width: 300rpx;
				height: 79rpx;
				background: #9E2922;
				border-radius: 39rpx;
				
				font-family: PingFang;
				font-weight: 800;
				font-size: 28rpx;
				color: #FFFFFF;
			}
			.agree {
				background: #5E9278 !important;
			}
		}
	}

	.textareaFont {
		font-family: PingFang;
		font-weight: 500;
		font-size: 25rpx;
		color: #A2A4B0;
	}
</style>