<template>
	<view class="home-page" :style="{ paddingTop: statusBarHeight + 'px' }">
		<image src="@/static/newUI3/node/joinNode.png" mode="scaleToFill" class="joinNode"></image>
		<view class='pledgeQuantity'>
			<view class="circle" v-for="item in numberArr ">
				{{ item }}
			</view>
		</view>
		<view class='describe'>
			全网总质押量（BIT）
		</view>
		<view class="methodsBox">
			<view class="methods" @click="gotoPage('./operate/createNode')">
				创建节点
			</view>
			<view class="methods" @click="gotoPage('./operate/pledge/pledge')">
				质押获取投票权
			</view>
		</view>
		<!-- <view class='nodeRules'>
			节点规则
		</view> -->
		<wallet-tabbar :currentIndex='1'></wallet-tabbar>
	</view>

</template>

<!-- <script lang="ts">
	import Vue from 'vue';
	import { UniUtil } from "@/data/util/uniUtil";
	import { BitInstance } from '@/chain/bit/instance';
	import { Witness } from 'bitweb-ts/lib/esm/types/Trx';
	import navigationBar from "@/components/navigationBar.vue"
	export default Vue.extend({
		components: { navigationBar },
		props: {
			refresh: {
				type: Number,
				default: 0
			}
		},
		watch: {
			refresh: {
				deep: true,
				async handler() {
					await this.init();
				}
			}
		},
		data() {
			return {
				show: {
					total: ''
				},
				statusBarHeight: 0,
				numberArr: []
			}
		},
		async created() {
			await this.init();
			const systemInfo = uni.getSystemInfoSync();
			this.statusBarHeight = systemInfo.statusBarHeight!;
		},
		methods: {
			async init() {
				UniUtil.loadShow();

				let totalPledgeNum = 0;
				await BitInstance.bitweb.trx.listSuperRepresentatives().then((witnessArr : Witness[]) => {
					witnessArr.map((witness : Witness) => {
						if (witness.voteCount === undefined) {
							witness.voteCount = 0;
						}
						totalPledgeNum += witness.voteCount;
					});
				}).catch((e : any) => { });
				this.show.total = totalPledgeNum.toString();
				let price : any = totalPledgeNum.toString()
				this.numberArr = price.split('')
				UniUtil.loadHide();
			},
			gotoPage(url : string) {
				uni.navigateTo({
					url
				})
			},
		}
	});


</script> -->、

<script setup lang="ts">
import { UniUtil } from '@/data/util/uniUtil';
import Vue from 'vue';
import { BitInstance } from '@/chain/bit/instance';
import { Witness } from 'bitweb-ts/lib/esm/types/Trx';
import navigationBar from "@/components/navigationBar.vue"

const props = defineProps({
	refresh: {
		type: Number,
		default: 0
	}
})

const show = ref({
	total: ''
});

const statusBarHeight = ref(0);
const numberArr = ref([])



onMounted(async () => {
	await init();
	const systemInfo = uni.getSystemInfoSync();
	statusBarHeight.value = systemInfo.statusBarHeight!;

})

watch(
	() => props.refresh,
	async (newval) => {
		if (newval !== -1) {
			await init()
		}
	},
	{ deep: true }
)

const init = async () => {
	UniUtil.loadShow();


	let totalPledgeNum = 0;


	try {
		//此接口见文档路径/trx/listSuperRepresentatives
		const witnessArr = await BitInstance.bitweb.trx.listSuperRepresentatives();

		// 遍历验证人列表，累加投票数
		witnessArr.forEach((witness: Witness) => {

			const voteCount = witness.voteCount ?? 0;
			totalPledgeNum += voteCount;
		});


		show.value.total = totalPledgeNum.toString();
		const price = totalPledgeNum.toString();
		numberArr.value = price.split('');

	} catch (e) {
		console.error('获取超级节点列表失败:', e);
	} finally {
		UniUtil.loadHide();
	}

}

const gotoPage = (url: string) => {
	uni.navigateTo({
		url
	})
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

	background-image: url('@/static/newUI3/index/index.png');
	background-size: 100% 100%;
	box-sizing: border-box;

	.joinNode {
		display: block;
		width: 625rpx;
		height: 660rpx;
		margin-top: 125rpx;
	}

	.pledgeQuantity {
		margin-top: 91rpx;
		display: flex;
		justify-content: center;
		width: 100%;
		height: 62rpx;

		// ps
		// background-color: skyblue;
		.circle {
			width: 62rpx;
			height: 62rpx;
			background: #FFFFFF;
			border-radius: 50%;
			border: 1px solid #A2A4B0;
			color: #000000;
			font-family: Impact;
			font-weight: 400;
			font-size: 46rpx;
			line-height: 62rpx;
			text-align: center;
			margin-right: 6rpx;
		}

		& .circle:last-child {
			margin-right: 0rpx;
		}
	}

	.describe {
		margin-top: 44rpx;
		width: 100%;
		height: 22rpx;
		font-family: PingFang;
		font-weight: 500;
		font-size: 22rpx;
		color: #000000;
		text-align: center;
		line-height: 22rpx;
	}

	.methodsBox {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		margin-top: 81rpx;
		width: 617rpx;
		height: 208rpx;

		.methods {
			display: flex;
			justify-content: center;
			align-items: center;
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

	.nodeRules {
		height: 22rpx;
		margin-top: 43rpx;
		font-family: PingFang;
		font-weight: 500;
		font-size: 22rpx;
		text-align: center;
		line-height: 22rpx;
		color: #A2A4B0;
		text-decoration-line: underline;
	}
}
</style>