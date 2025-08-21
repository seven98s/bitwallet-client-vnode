export {};
declare global {
    /**Wallet Bit */
    export namespace WalletBit {
        /**Account Module */
        export namespace Account {

            /**import mnemonic */
            export interface ImportMnemonicDto {
                mnemonic: string;
            }
            export interface ImportMnemonicVo {
                address: string;
                privateKey: string;
                path: string;
            }

            /**import private key */
            export interface ImportPrivateKeyDto {
                privateKey: string;
            }
            export interface ImportPrivateKeyVo {
                address: string;
                privateKey: string;
            }

            /**create account by mnemonic */
            export interface CreateByMnemonicDto {}
            export interface CreateByMnemonicVo {
                mnemonic: string;
                address: string;
                privateKey: string;
                path: string;
            }

            /**create account by wallet */
            export interface CreateByWalletDto {
                mnemonic: string;
                path: string;
            }
            export interface CreateByWalletVo {
                address: string;
                privateKey: string;
                path: string;
            }

            /**get account info */
            export interface GetAccountInfoDto {
                address: string;
            }
            export interface GetAccountInfoVo {
                address: string;
                balance: number;
                owner_permission: { 
                    permission_name: string, 
                    threshold: number, 
                    keys: [];
                };
                active_permission: {
                    type: string,
                    id: number;
                    permission_name: string;
                    threshold: number;
                    operations: string;
                    keys: [];
                }[];
            }

        }
    }
}
