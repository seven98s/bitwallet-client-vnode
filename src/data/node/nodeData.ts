import "./@types";
import { CHAIN_TYPE, STORAGE_TYPE, NODE_TYPE } from "../constants";
import { CryptoUtil } from "../util/cryptoUtil";
import { BitInstance } from '@/chain/bit/instance';
import { nodes } from "@/config";
export class NodeData {
	
	static init() {
		let bitNodes = new Array<NodeCache.Node>();
		bitNodes=[...nodes]
		// bitNodes.push({ 
		// 	chainType: CHAIN_TYPE.BIT, name: 'BIT-1', 
		// 	url: 'http://47.237.120.2:6005', 
		// 	solidityUrl: 'http://47.237.120.2:6006', 
		// 	scanUrl: "http://47.236.254.203:9000/bitscan", 
		// 	speed: 0, type: NODE_TYPE.SYSTEM 
		// });
		// bitNodes.push({ 
		// 	chainType: CHAIN_TYPE.BIT, name: 'BIT-2', 
		// 	url: 'http://47.236.254.203:6005', 
		// 	solidityUrl: 'http://47.236.254.203:6006', 
		// 	scanUrl: "http://47.236.254.203:9000/bitscan", 
		// 	speed: 0, type: NODE_TYPE.SYSTEM 
		// });
		
		// bitNodes.push({
		// 	chainType: CHAIN_TYPE.BIT, name: 'BIT-1', 
		// 	url: 'http://fullnodesg1.bitnetworkbc.com', 
		// 	solidityUrl: 'http://soliditynodesg1.bitnetworkbc.com', 
		// 	scanUrl: "http://chaindataapi.bitnetworkbc.com/bitscan", 
		// 	speed: 0, type: NODE_TYPE.SYSTEM 
		// });
		// bitNodes.push({
		// 	chainType: CHAIN_TYPE.BIT, name: 'BIT-2', 
		// 	url: 'http://fullnodetyo1.bitnetworkbc.com', 
		// 	solidityUrl: 'http://soliditynodetyo1.bitnetworkbc.com', 
		// 	scanUrl: "http://chaindataapi.bitnetworkbc.com/bitscan", 
		// 	speed: 0, type: NODE_TYPE.SYSTEM 
		// });
		// bitNodes.push({
		// 	chainType: CHAIN_TYPE.BIT, name: 'BIT-3', 
		// 	url: 'http://fullnodesv1.bitnetworkbc.com', 
		// 	solidityUrl: 'http://soliditynodesv1.bitnetworkbc.com', 
		// 	scanUrl: "http://chaindataapi.bitnetworkbc.com/bitscan", 
		// 	speed: 0, type: NODE_TYPE.SYSTEM 
		// });
		
		const nodeInfo: { [key: string] : NodeCache.Node[] } = {};
		nodeInfo[CHAIN_TYPE.BIT] = bitNodes;
		
		uni.setStorageSync(STORAGE_TYPE.NODE_INFO, nodeInfo);
		// this.chooseNode(bitNodes[0]);
	}
	
	static list() {
		return uni.getStorageSync(STORAGE_TYPE.NODE_INFO);
	}
	
	static add(chainType: CHAIN_TYPE, param: NodeCache.Node) {
		const nodeInfo = uni.getStorageSync(STORAGE_TYPE.NODE_INFO);
		let nodes = nodeInfo[chainType];
		if(nodeInfo[chainType] === undefined || nodeInfo[chainType].length === 0) {
			nodes = new Array<NodeCache.Node>();
		}
		param.type = NODE_TYPE.CUSTOM;
		nodes.push(param);
		nodeInfo[chainType] = nodes;
		
		uni.setStorageSync(STORAGE_TYPE.NODE_INFO, nodeInfo);
	}
	
	static chooseNode(param: NodeCache.Node) {
		if(param.chainType === CHAIN_TYPE.BIT) {
			const { url, solidityUrl, scanUrl } = param;
			BitInstance.setProvider(url, solidityUrl, url, scanUrl, "");
		}
		
		uni.setStorageSync(STORAGE_TYPE.CURRENT_NODE_INFO, param);
	}
	
	static node() {
		return uni.getStorageSync(STORAGE_TYPE.CURRENT_NODE_INFO);
	}
	
}