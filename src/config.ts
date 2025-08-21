
// Cannot find module '@/data/node/type
import "@/data/node//@types"
import { CHAIN_TYPE, NODE_TYPE } from "@/data/constants";
// let mode=process.env.VUE_APP_MODE
let mode='dev'
const nodes = new Array<NodeCache.Node>();
let version_url_1=''
let version_url_2=''
 let chainId='' 
 let toChainScanUrl=''
 let baseURL=''
if(mode=='dev') {
	nodes.push({
		chainType: CHAIN_TYPE.BIT, name: 'BIT-1', 
		url: 'http://47.237.120.2:6005', 
		solidityUrl: 'http://47.237.120.2:6006', 
		scanUrl: "http://47.236.254.203:9000/bitscan", 
		speed: 0, type: NODE_TYPE.SYSTEM ,
		nodeLocation:'Singapore',
	});
	nodes.push({ 
		chainType: CHAIN_TYPE.BIT, name: 'BIT-2', 
		url: 'http://47.236.254.203:6005', 
		solidityUrl: 'http://47.236.254.203:6006', 
		scanUrl: "http://47.236.254.203:9000/bitscan", 
		speed: 0, type: NODE_TYPE.SYSTEM ,
		nodeLocation:'Singapore',
	});
	
	version_url_1='http://47.236.254.203:6007/releaseNote.json?timestamp='+new Date().getTime()
	version_url_2='http://47.236.254.203:6007/recommendDapp/recommendDapp.json?timestamp='+new Date().getTime()
	
	chainId='20240618'
	toChainScanUrl='http://47.236.254.203:6002/#/transaction/'
	baseURL='http://47.236.254.203:9008/wallet'
}else if(mode=='test') {
	nodes.push({
		chainType: CHAIN_TYPE.BIT, name: 'BIT-1', 
		url: 'http://47.237.120.2:6005', 
		solidityUrl: 'http://47.237.120.2:6006', 
		scanUrl: "http://47.236.254.203:9000/bitscan", 
		speed: 0, type: NODE_TYPE.SYSTEM ,
		nodeLocation:'Singapore',
	});
	nodes.push({ 
		chainType: CHAIN_TYPE.BIT, name: 'BIT-2', 
		url: 'http://47.236.254.203:6005', 
		solidityUrl: 'http://47.236.254.203:6006', 
		scanUrl: "http://47.236.254.203:9000/bitscan", 
		speed: 0, type: NODE_TYPE.SYSTEM ,
		nodeLocation:'Singapore',
	});
	
	version_url_1='http://47.236.254.203:6007/releaseNote.json?timestamp='+new Date().getTime()
	version_url_2='http://47.236.254.203:6007/recommendDapp/recommendDapp.json?timestamp='+new Date().getTime()
	
	chainId='20240618'
	toChainScanUrl='http://47.236.254.203:6002/#/transaction/'
	baseURL='http://47.236.254.203:9008/wallet'
	
}else if(mode=='prod') {
	nodes.push({
		chainType: CHAIN_TYPE.BIT, name: 'BIT-1', 
		url: 'http://fullnodesg1.bitnetworkbc.com', 
		solidityUrl: 'http://soliditynodesg1.bitnetworkbc.com', 
		scanUrl: "http://chaindataapi.bitnetworkbc.com/bitscan", 
		speed: 0, type: NODE_TYPE.SYSTEM ,
		nodeLocation:'Singapore',
	});
	nodes.push({
		chainType: CHAIN_TYPE.BIT, name: 'BIT-2', 
		url: 'http://fullnodetyo1.bitnetworkbc.com', 
		solidityUrl: 'http://soliditynodetyo1.bitnetworkbc.com', 
		scanUrl: "http://chaindataapi.bitnetworkbc.com/bitscan", 
		speed: 0, type: NODE_TYPE.SYSTEM ,
		nodeLocation:'Tokyo',
	});
	nodes.push({
		chainType: CHAIN_TYPE.BIT, name: 'BIT-3', 
		url: 'http://fullnodesv1.bitnetworkbc.com', 
		solidityUrl: 'http://soliditynodesv1.bitnetworkbc.com', 
		scanUrl: "http://chaindataapi.bitnetworkbc.com/bitscan", 
		speed: 0, type: NODE_TYPE.SYSTEM ,
		nodeLocation:'America',
	});
	
	
	
	version_url_1='http://download.bitnetworkbc.com/releaseNote.json?timestamp='+new Date().getTime()
	version_url_2='http://download.bitnetworkbc.com/recommendDapp/recommendDapp.json?timestamp='+new Date().getTime()
	
	chainId='20241001'
	toChainScanUrl='http://bitscan.bitnetworkbc.com/#/transaction/'
	baseURL='http://bitwalletapi.bitnetworkbc.com/wallet'
}
export { nodes, version_url_1, version_url_2, chainId ,toChainScanUrl,baseURL};