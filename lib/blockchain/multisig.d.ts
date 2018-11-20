import BlockChain from "./blockchain";
import { multisigInfo } from "./interface";
export declare enum type {
    MAKE = "multisig-make",
    TRAN = "multisig-tran",
    APPROVE = "multisig-approve",
    MULTISIG = "multisig"
}
interface multisigData {
    myShare: string;
    shares: Array<string>;
    threshold: number;
    pubKey: string;
    encryptSecKey: string;
    isOwner?: boolean;
}
export default class Multisig {
    multiSig: {
        [key: string]: multisigData;
    };
    address: string;
    b: BlockChain;
    private onMultisigTran;
    private onMultisigTranDone;
    events: {
        onMultisigTran: {
            [key: string]: (v?: any) => void;
        };
    };
    private excuteEvent;
    constructor(blockchain: BlockChain);
    responder(tran: any): void;
    makeNewMultiSigAddress(friendsPubKeyAes: Array<string>, //共有者の情報
    vote: number, //しきい値
    amount: number): {
        sender: string;
        recipient: string;
        amount: number;
        data: any;
        now: number;
        publicKey: string;
        sign: string;
    };
    private getMultiSigKey;
    makeMultiSigTransaction(multisigAddress: string): {
        sender: string;
        recipient: string;
        amount: number;
        data: any;
        now: number;
        publicKey: string;
        sign: string;
    } | undefined;
    private onMultiSigTransaction;
    approveMultiSig(info: multisigInfo): {
        sender: string;
        recipient: string;
        amount: number;
        data: any;
        now: number;
        publicKey: string;
        sign: string;
    } | undefined;
    private onApproveMultiSig;
    verifyMultiSig(info: multisigInfo, shares: Array<any>): {
        sender: string;
        recipient: string;
        amount: number;
        data: any;
        now: number;
        publicKey: string;
        sign: string;
    } | undefined;
}
export {};