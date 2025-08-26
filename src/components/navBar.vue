<!-- <template>
	<view class="navBarComponent">
		<view class="left">
			<i class="icon" @click="gotoPage($props.backUrl)"></i>
		</view>
		<view class="middle">
			{{ $props.title }}
		</view>
		<view class="right"></view>
	</view>
</template>

<script lang="ts">
	import Vue from 'vue';

	export default Vue.extend({
		props: {
			title: {
				type: String,
				default: ''
			},
			backUrl: {
				type: String,
				default: ''
			},
			isTab: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {}
		},
		async created() {},
		methods: {
			gotoPage(url: string) {
				if(this.isTab) {
					uni.reLaunch({
					  url
					});
				} else {
					uni.navigateTo({
					  url 
					});
				}
			},
		}
	});
</script>

<style lang="scss" scoped>
	.navBarComponent {
		height: 100rpx;
		background-color: white;
		margin-bottom: 20rpx;
		display: flex;
		// justify-content: space-between;
		align-items: center;
		.left {
			flex: 1;
			padding-left: 30rpx;
			.icon {
				border: solid black;
				border-width: 0 2rpx 2rpx 0;
				display: inline-block;
				padding: 10rpx;
				transform: rotate(135deg);
				-webkit-transform: rotate(135deg);
			}
		}
		.middle {
			flex: 2;
			padding-left: 15rpx;
			font-size: 38rpx;
		}
	}
</style> -->