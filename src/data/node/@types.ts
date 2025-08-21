import { BitWeb } from 'bitweb-ts';
import { ACCOUNT_TYPE, CHAIN_TYPE, NODE_TYPE } from "../constants";

export {};
declare global {
    export namespace NodeCache {
		
		export type CurrentNode = Node;
		
		export interface NodeInfo {
			nodes: {
				// chain => node
				[key: string] : Node[]
			};
		}
		
		export interface Node {
			chainType: CHAIN_TYPE,
			name: string;
			url: string;
			solidityUrl: string;
			scanUrl: string;
			speed: number;
			type: NODE_TYPE;
			nodeLocation:string
		}
    }
}
