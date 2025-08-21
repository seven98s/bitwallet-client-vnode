<template>
	<view class="page">
		
		<view class="main">
			<view class="to">
				<view class="top">
					<view class="letter">
						节点地址
					</view>
					<view class="scan">
						<image src="@/static/wallet/transfer/transfer/scan.png" alt="" />
					</view>
				</view>
				<view class="bottom">
					<input type="text" placeholder="输入、扫描或粘贴节点地址" v-model="param.createNode.nodeAddress" />
				</view>
			</view>
			
			<view class="content">
				<view class="module">
					<view class="title">
						投入数量（BIT）
					</view>
					<view class="input">
						<input type="text" placeholder="请输入参与节点投入数量" v-model="param.createNode.voteNum" />
					</view>
				</view>
				<view class="module">
					<view class="title">
						钱包密码
					</view>
					<view class="input">
						<input type="password" placeholder="请输入密码,至少8位数" v-model="param.createNode.password" />
					</view>
					<view class="input">
						<input type="password" placeholder="确认密码" v-model="param.createNode.rePassword" />
					</view>
				</view>
				
				<TermAndPrivacy :termPrivacyAgree="termPrivacyStatus" @termPrivacyAgree="handleTermPrivacyAgree"></TermAndPrivacy>
			
				<view class="import">
					投票加入
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script lang="ts">
import Vue from 'vue';
import TermAndPrivacy from "@/components/termAndPrivacy.vue";
import { BitInstance } from '@/chain/bit/instance';

export default Vue.extend({
	components: { TermAndPrivacy },
	data() {
		return {
			termPrivacyStatus: false,
			param: {
				createNode: {
					nodeAddress: '',
					voteNum: '',
					password: '',
					rePassword: '',
				},
			},
		}
	},
	onLoad() {},
	methods: {
		handleTermPrivacyAgree(value: boolean) {
			this.termPrivacyStatus = value;
		},
	}
});
</script>

<style lang="scss" scoped>
	.page {
		// height: calc(100vh - 120rpx);
		min-height: calc(100vh - 120rpx);
		background-color: rgb(235 235 235);
		padding: 20rpx 0rpx;
		
		.main {
			margin: 0rpx 40rpx;
			.to {
				background-color: white;
				padding: 20rpx;
				border-radius: 20rpx;
				.top {
					display: flex;
					.letter {
						flex: 2;
					}
					.scan {
						margin-left: 20rpx;
						image {
							width: 40rpx;
							height: 40rpx;
						}
					}
				}
				
				.bottom {
					margin: 20rpx 0rpx;
					input {
						padding: 20rpx;
						background-color: rgb(235 235 235);
						border-radius: 20rpx;
					}
				}
			}
			
			.content {
				background-color: white;
				padding: 20rpx;
				border-radius: 20rpx;
				margin-top: 20rpx;
				
				.module {
					margin-top: 20rpx;
					.input {
						margin-top: 10rpx;
						border-bottom: 2rpx dotted #e2e2e2;
						padding-left: 6rpx;
					}
					.input+.input {
						margin-top: 20rpx;
					}
				}
				
					
				.import {
					margin: 40rpx;
					margin-top: 80rpx;
					height: 120rpx;
					background-image: url('@/static/wallet/buttonBg.png');
					background-size: 100%;
					background-position: center;
					background-repeat: no-repeat;
					
					text-align: center;
					line-height: 120rpx;
					color: white;
					font-size: 40rpx;
				}
			}
		}
		
	}
</style>