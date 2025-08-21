import { BitWebEx } from './webEx';
import { providers } from 'bitweb-ts';

export class BitInstance {
    private static __bitweb: BitWebEx;
    static get bitweb(): BitWebEx {
        if (this.__bitweb) {
            return this.__bitweb;
        } else {
            throw new Error(`__bitWeb is not init`);
        }
    }

    static setProvider(fullNode: string, solidityNode: string, eventNode: string, scanNode: string, privateKey: string) {
        const HttpProvider = providers.HttpProvider;
        const fullServer = new HttpProvider(fullNode);
        const solidityServer = new HttpProvider(solidityNode);
        const eventServer = new HttpProvider(eventNode);
        const scanServer = new HttpProvider(scanNode);
        const bitWeb = new BitWebEx(fullServer, solidityServer, eventServer, scanServer, privateKey);
        this.__bitweb = bitWeb;
    }
}