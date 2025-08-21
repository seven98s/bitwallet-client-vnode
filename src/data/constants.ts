export enum STORAGE_TYPE {
	
	/**Wallet Module */
	WALLET_USER_INFO = "storage_wallet_user",
	WALLET_INDEX = "storage_wallet_index", // 钱包名称索引
	WALLET_ACCOUNT_CHAIN_MAP = "storage_wallet_account_chain_map",
	WALLET_CURRENT_ACCOUNT = "storage_wallet_current_account",
	MNEMONIC_INFO = "storage_wallet_mnemonic_info", // 助记词信息
	MNEMONIC_TEMP_INFO = "storage_mnemonic_temp_info", // 助记词临时信息
	
	// /**Wallet Module */
	// WALLET_INFO = "storage_wallet_info", // 钱包信息
	// WALLET_ADDRESS_ACCOUNT_MAPPING_INFO = "storage_wallet_account_mapping_info", // 地址 =》 钱包信息映射
	// CURRENT_WALLET_INFO = "storage_current_wallet_info", // 当前选中钱包
	
	/**Node Module */
	NODE_URL_MAPPING_INFO = "storage_node_url_mapping_info", // 地址 =》 节点信息映射
	CURRENT_NODE_INFO = "storage_current_node_info", // 当前选中节点
	NODE_INFO = "storage_node_info", // 节点列表
	
	/**AddressBook Module */
	ADDRESS_BOOK_INFO = "storage_address_book_info",
	
	/**Version Module */
	// NEW_VERSION = "storage_new_version",
	IGNORE_VERSION = "storage_ignore_version",
}

export enum CHAIN_TYPE {
	BIT,
	TRON,
	ETH,
	BSC,
}

export enum ACCOUNT_TYPE {
	NORMAL,
	IMPORT,
	OBSERVE,
}

export enum NODE_TYPE {
	SYSTEM,
	CUSTOM,
}

export const PROPOSAL_MAP = new Array();
PROPOSAL_MAP.push({key:'getMaintenanceTimeInterval', describe:'提议修改超级代表调整时间间隔', no: 0});
PROPOSAL_MAP.push({key:'getAccountUpgradeCost', describe:'提议修改账户升级为超级代表的费用', no: 1});
// PROPOSAL_MAP.push({key:'getCreateAccountFee', describe:'提议修改创建账户费用'});
PROPOSAL_MAP.push({key:'getTransactionFee', describe:'提议修改 1 Bytes的费用', no: 3});
PROPOSAL_MAP.push({key:'getAssetIssueFee', describe:'提议修改通证发行费用', no: 4});
PROPOSAL_MAP.push({key:'getWitnessPayPerBlock', describe:'提议修改超级代表出块奖励'});
// PROPOSAL_MAP.push({key:'getCreateNewAccountFeeInSystemContract', describe:'提议修改系统合约中创建账户的费用'});
PROPOSAL_MAP.push({key:'getAllowCreationOfContracts', describe:'提议开启虚拟机功能', no: 7});
PROPOSAL_MAP.push({key:'getRemoveThePowerOfTheGr', describe:'提议清除GR的创世票数', no: 8});
PROPOSAL_MAP.push({key:'getExchangeCreateFee', describe:'提议修改创建交易对的费用', no: 9});
PROPOSAL_MAP.push({key:'getMaxCpuTimeOfOneTx', describe:'提议修改一条交易的最大执行时间', no: 10});
// PROPOSAL_MAP.push({key:'getAllowUpdateAccountName', describe:'提议允许账户重名', no: 11});
PROPOSAL_MAP.push({key:'getAllowSameTokenName', describe:'提议允许通证同名', no: 12});
// PROPOSAL_MAP.set('getAllowDelegateResource', '提议允许资源委派');
// PROPOSAL_MAP.set('getAllowTvmTransferTrc10', '提议允许智能合约转BRC-10的通证');
PROPOSAL_MAP.push({key:'getAllowMultiSign', describe:'提议允许开启多重签名功能', no: 15});
PROPOSAL_MAP.push({key:'getUpdateAccountPermissionFee', describe:'提议修改更新账户权限的费用', no: 16});
PROPOSAL_MAP.push({key:'getMultiSignFee', describe:'提议修改多重签名的费用', no: 17});
PROPOSAL_MAP.push({key:'getStartRewardBlock', describe:'提议开始区块奖励区块号', no: 51});
PROPOSAL_MAP.push({key:'getBlacklist', describe:'提议黑名单列表', no: 52});
// PROPOSAL_MAP.set('getAllowAccountStateRoot', '');
// PROPOSAL_MAP.set('getAllowProtoFilterNum', '');
// PROPOSAL_MAP.set('getAllowTvmConstantinople', '');
// PROPOSAL_MAP.set('getAllowTvmSolidity059', '提议允许虚拟机支持0.5.9版本的Solidity编译器');
// PROPOSAL_MAP.set('getAllowTvmIstanbul', '');
// PROPOSAL_MAP.set('getAllowShieldedTRC20Transaction', '');
// PROPOSAL_MAP.set('getForbidTransferToContract', '');
// PROPOSAL_MAP.set('getChangeDelegation', '');
// PROPOSAL_MAP.set('getWitness127PayPerBlock', '');
// PROPOSAL_MAP.set('getAllowMarketTransaction', '');
// PROPOSAL_MAP.set('getMarketSellFee', '');
// PROPOSAL_MAP.set('getMarketCancelFee', '');
// PROPOSAL_MAP.set('getAllowPBFT', '');
// PROPOSAL_MAP.set('getAllowTransactionFeePool', '');
// PROPOSAL_MAP.set('getMaxFeeLimit', '');
// PROPOSAL_MAP.set('getAllowOptimizeBlackHole', '');
// PROPOSAL_MAP.set('getAllowNewResourceModel', '');
// PROPOSAL_MAP.set('getAllowTvmFreeze', '');
// PROPOSAL_MAP.set('getAllowTvmVote', '');
// PROPOSAL_MAP.set('getAllowTvmLondon', '');
// PROPOSAL_MAP.set('getAllowTvmCompatibleEvm', '');
// PROPOSAL_MAP.set('getAllowAccountAssetOptimization', '');
// PROPOSAL_MAP.set('getAllowHigherLimitForMaxCpuTimeOfOneTx', '');
// PROPOSAL_MAP.set('getAllowAssetOptimization', '');
// PROPOSAL_MAP.set('getAllowNewReward', '');
// PROPOSAL_MAP.set('getMemoFee', '');
// PROPOSAL_MAP.set('getAllowDelegateOptimization', '');
// PROPOSAL_MAP.set('getUnfreezeDelayDays', '');
// PROPOSAL_MAP.set('getAllowOptimizedReturnValueOfChainId', '');
// PROPOSAL_MAP.set('getAllowTvmShangHai', '');
// PROPOSAL_MAP.set('getAllowCancelAllUnfreezeV2', '');
// PROPOSAL_MAP.set('getMaxDelegateLockPeriod', '');
// PROPOSAL_MAP.set('getAllowOldRewardOpt', '');
