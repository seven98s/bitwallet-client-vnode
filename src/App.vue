<script setup lang="ts">
import Vue from 'vue';
import { NodeData } from './data/node/nodeData';
import { STORAGE_TYPE, CHAIN_TYPE } from './data/constants';
import { WalletData } from './data/wallet/walletData';

import { onLaunch, onShow, onHide, } from "@dcloudio/uni-app";
onLaunch(() => {
	console.log('启动')
})
onShow(() => {
	console.log('显示')
});
onHide(() => {
	console.log("隐藏");
});




// export default Vue.extend({
// mpType: 'app',
// async onLaunch() {
// console.log('App Launch')
// uni.hideTabBar()
// NodeData.init();
// // 初始化节点实例
// const node = uni.getStorageSync(STORAGE_TYPE.CURRENT_NODE_INFO);
// let setNode = node;
// if(setNode.name === undefined) {
// const nodeInfo = uni.getStorageSync(STORAGE_TYPE.NODE_INFO);
// setNode = nodeInfo[CHAIN_TYPE.BIT][0];
// }
// NodeData.chooseNode(setNode);
// if(WalletData.account.address !== undefined) {
// WalletData.chooseAccount(WalletData.account);
// }

// },
// onShow() {
// console.log('App Show')
// },
// onHide() {
// console.log('App Hide')
// }
// });

</script>



<style>
/*每个页面公共css */
.page {
	font-family: '华文中宋';
}

.uni-page-head__title {
	font-family: '华文中宋';
	font-size: 18px !important;
	font-weight: 500 !important;
}

.uni-tabbar {
	height: 60px;
}

.uni-tabbar__label {
	font-family: '华文中宋';
	font-size: 13px !important;
}

.common-gray {
	background-color: rgb(235 235 235);
	height: 8px;
}

uni-modal {
	z-index: 9999998 !important;
}

.common-bgImage {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: -1;
}

.common-bgGray {
	background-color: rgb(235 235 235);
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: -1;
}
</style>
