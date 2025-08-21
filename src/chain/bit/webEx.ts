import { BitWeb } from 'bitweb-ts';
import { TrxEx } from './trxEx';

export class BitWebEx extends BitWeb {
	trxEx: TrxEx;
	constructor(fullNode: any, solidityNode: any, eventServer: any, scanServer?: any, privateKey?: string) {
		super(fullNode, solidityNode, eventServer, scanServer, privateKey);
		this.trx = new TrxEx(this);
		this.trxEx = new TrxEx(this);
	}
}
