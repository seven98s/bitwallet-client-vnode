<template>
	<view class="termAndPrivacy">
		<label class="radio">
			<radio :checked="termPrivacyAgree" @click="check"><text>我已仔细阅读并同意<span class="title2">服务条款</span>及<span
						class="title2">隐私条款</span></text></radio>
		</label>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		props: {
			termPrivacyAgree: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {}
		},
		methods: {
			check() {
				this.$emit('termPrivacyAgree', true);
			}
		}
	});
</script>

<style lang="scss" scoped>
	.termAndPrivacy {
		width: 100%;
		margin-top: 31rpx;
		padding-left: 6rpx;
		box-sizing: border-box;
		font-family: PingFang;
		font-weight: 500;
		font-size: 28rpx;
		color: #231815;
		line-height: 28rpx;

		.radio {

			::v-deep .uni-radio-input {
				width: 20rpx;
				height: 20rpx;
			}

			/* 当单选按钮被选中时的外圈样式 */
			::v-deep .uni-radio-input-checked:before {
				position: absolute;
				content: '';
				width: 20rpx;
				height: 20rpx;
				border: 2rpx solid #9E2922;
				background: white;
				border-radius: 50%;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}

			/* 当单选按钮被选中时的内圈样式 */
			::v-deep .uni-radio-input-checked:after {
				position: absolute;
				content: '';
				width: 13rpx;
				height: 13rpx;
				background: #9E2922;
				border-radius: 50%;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}

		.title2 {
			
			font-size: 28rpx;
			color: #9E2922;
		}
	}
</style>