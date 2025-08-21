import { ACCOUNT_TYPE, CHAIN_TYPE } from "../constants";

export {};
declare global {
    export namespace Version {
		
		export type versions = VersionInfo[]
		export type CurrentVersion = VersionInfo
		
		export interface VersionInfo {
			no: string;
			describe: Array<string>;
			apkUrl: string;
			forceUpdate: boolean;
		}
    }
}
