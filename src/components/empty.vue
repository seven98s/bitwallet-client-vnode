<template>
	<view class="emptyComponent">
		<view class="top">
			<image src="@/static/empty.svg" mode=""></image>
		</view>
		<view class="bottom">
			暂无数据
		</view>
	</view>
</template>

<script setup lang="ts">

const props = defineProps({
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
});

const gotoPage = (url: string) => {
	if (props.isTab) {
		uni.reLaunch({
			url
		});
	} else {
		uni.navigateTo({
			url
		})
	}
}

</script>

<style lang="scss" scoped>
	.emptyComponent {
		text-align: center;
		.top {
			image {
				width: 200rpx;
				height: 200rpx;
			}
		}
		.bottom {
			color: rgb(192 199 205);
		}
	}
</style>