import sha256 from "sha256";
import { Decimal } from "decimal.js";
import Cypher from "./crypto/cypher";
import type from "./type";
import { ETransactionType } from "./interface";
import { excuteEvent } from "../util";
import { verifyMessageWithPublicKey } from "./crypto/sign";
import Account from "./account";

const diff = /^000/;

export interface IBlock {
  index: number;
  timestamp: any;
  transactions: ITransaction[];
  proof: number;
  previousHash: string;
  owner: string;
  publicKey: string;
  sign: string;
}

export interface ITransactionData {
  type: ETransactionType;
  payload: any;
}

export interface ITransaction {
  sender: string;
  recipient: string;
  amount: number;
  data: ITransactionData;
  now: any;
  publicKey: string;
  nonce: number;
  sign: string;
}

export function hash(obj: object) {
  const objString = JSON.stringify(obj, Object.keys(obj).sort());
  return sha256(objString);
}

export function jsonStr(obj: object) {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

export function validProof(
  lastProof: number,
  proof: number,
  lastHash: string,
  address: string
) {
  const guess = `${lastProof}${proof}${lastHash}${address}`;
  const guessHash = sha256(guess);
  return diff.test(guessHash);
}

export function validChain(chain: IBlock[]) {
  let index = 2;
  let result = true;
  while (index < chain.length) {
    const lastBlock = chain[index - 1];
    const lastProof = lastBlock.proof;
    const lastHash = hash(lastBlock);
    const block = chain[index];
    const owner = block.owner;

    //ブロックの持つ前のブロックのハッシュ値と実際の前の
    //ブロックのハッシュ値を比較
    if (block.previousHash !== lastHash) {
      console.log("blockchain hash error", { block });
      result = false;
      break;
    }
    //ナンスの値の検証
    if (!validProof(lastProof, block.proof, lastHash, owner)) {
      console.log("blockchain nonce error", { block });
      result = false;
      break;
    }
    index++;
  }
  return result;
}

export function validBlock(lastBlock: IBlock, block: IBlock): boolean {
  const lastProof = lastBlock.proof;
  const lastHash = hash(lastBlock);
  const owner = block.owner;
  const sign = block.sign;
  const publicKey = block.publicKey;
  block.sign = "";

  //署名が正しいかどうか
  if (
    verifyMessageWithPublicKey({
      message: hash(block),
      publicKey,
      signature: sign
    })
  ) {
    block.sign = sign;
    //ナンスが正しいかどうか
    if (validProof(lastProof, block.proof, lastHash, owner)) {
      return true;
    } else {
      console.log("block nonce error");
      return false;
    }
  } else {
    console.log("block sign error");
    return false;
  }
}

export default class BlockChain {
  chain: IBlock[] = [];
  currentTransactions: Array<any> = [];
  cypher: Cypher;
  address: string;
  accout: Account;

  callback = {
    onAddBlock: (v?: any) => {}
  };

  private onAddBlock: { [key: string]: () => void } = {};
  private onTransaction: { [key: string]: () => void } = {};
  private onMadeTransaction: {
    [key: string]: (tran: ITransaction) => void;
  } = {};
  events = {
    onAddBlock: this.onAddBlock,
    onTransaction: this.onTransaction,
    onMadeTransaction: this.onMadeTransaction
  };

  constructor(phrase?: string) {
    this.cypher = new Cypher(phrase);
    this.accout = new Account(phrase);
    this.address = sha256(this.cypher.pubKey);
    this.newBlock(0, "genesis");
  }

  newBlock(proof: any, previousHash: string) {
    //採掘報酬
    const tran = this.newTransaction(type.SYSTEM, this.address, 1, {
      type: ETransactionType.transaction,
      payload: "reward"
    });
    this.currentTransactions.push(tran);

    const block: IBlock = {
      index: this.chain.length + 1, //ブロックの番号
      timestamp: Date.now(), //タイムスタンプ
      transactions: this.currentTransactions, //トランザクションの塊
      proof: proof, //ナンス
      previousHash: previousHash || hash(this.lastBlock()), //前のブロックのハッシュ値
      owner: this.address, //このブロックを作った人
      publicKey: this.cypher.pubKey, //このブロックを作った人の公開鍵
      sign: "" //このブロックを作った人の署名
    };
    //署名を生成
    block.sign = this.cypher.signMessage(hash(block)).signature;
    //ブロックチェーンに追加
    if (
      this.chain.length > 0 &&
      !validBlock(this.chain[this.chain.length - 1], block)
    ) {
      return undefined;
    }
    this.chain.push(block);

    //トランザクションプールをリセット
    this.currentTransactions = [];
    return block;
  }

  newTransaction(
    sender: string,
    recipient: string,
    amount: number,
    data: { type: ETransactionType; payload: any },
    cypher = this.cypher
  ): ITransaction {
    const tran: ITransaction = {
      sender: sender, //送信アドレス
      recipient: recipient, //受取アドレス
      amount: amount, //量
      data, //任意のメッセージ
      now: Date.now(), //タイムスタンプ
      publicKey: cypher.pubKey, //公開鍵,
      nonce: this.getNonce(),
      sign: "" //署名
    };
    tran.sign = cypher.signMessage(hash(tran)).signature;
    //トランザクションを追加
    //this.currentTransactions.push(tran);

    return tran;
  }

  lastBlock(blockchain = this.chain): IBlock {
    return blockchain[blockchain.length - 1];
  }

  addBlock(block: IBlock) {
    if (validBlock(this.chain[this.chain.length - 1], block)) {
      this.currentTransactions = [];
      this.chain.push(block);
      this.callback.onAddBlock();
      excuteEvent(this.events.onAddBlock);
    }
  }

  validTransaction(transaction: ITransaction) {
    const amount = transaction.amount;
    const sign = transaction.sign;

    const result = this.currentTransactions.find(prev => {
      return prev.sign === sign;
    });
    if (result) {
      console.log("duplicate error", { result });
      return false;
    }

    const publicKey = transaction.publicKey;
    const address = transaction.sender;
    transaction.sign = "";

    //公開鍵が送金者のものかどうか
    if (sha256(publicKey) === address) {
      //署名が正しいかどうか
      //公開鍵で署名を解読しトランザクションのハッシュ値と一致することを確認する。
      if (
        verifyMessageWithPublicKey({
          message: hash(transaction),
          publicKey,
          signature: sign
        })
      ) {
        const balance = this.nowAmount(address);
        //送金可能な金額を超えているかどうか
        if (balance >= amount) {
          //消した署名を戻す
          transaction.sign = sign;
          return true;
        } else {
          console.log("balance error", amount, balance);
          return false;
        }
      } else {
        console.log("sign error");
        return false;
      }
    } else {
      console.log("pubkey error");
      return false;
    }
  }

  addTransaction(tran: ITransaction) {
    if (this.validTransaction(tran)) {
      //トランザクションを追加
      this.currentTransactions.push(tran);
      excuteEvent(this.events.onTransaction);
    } else {
      console.log("error Transaction", { tran });
    }
  }

  proofOfWork() {
    const lastBlock = this.lastBlock();
    const lastProof = lastBlock.proof;
    const lastHash = hash(lastBlock);

    let proof = 0;

    while (!validProof(lastProof, proof, lastHash, this.address)) {
      //ナンスの値を試行錯誤的に探す
      proof++;
    }

    return proof;
  }

  nowAmount(address = this.address) {
    let tokenNum = new Decimal(0.0);
    this.chain.forEach(block => {
      block.transactions.forEach((transaction: any) => {
        if (transaction.recipient === address) {
          tokenNum = tokenNum.plus(new Decimal(parseFloat(transaction.amount)));
        }
        if (transaction.sender === address) {
          tokenNum = tokenNum.minus(
            new Decimal(parseFloat(transaction.amount))
          );
        }
      });
    });
    this.currentTransactions.forEach(transaction => {
      if (transaction.recipient === address) {
        tokenNum = tokenNum.plus(new Decimal(parseFloat(transaction.amount)));
      }
      if (transaction.sender === address) {
        tokenNum = tokenNum.minus(new Decimal(parseFloat(transaction.amount)));
      }
    });
    return tokenNum.toNumber();
  }

  getAllTransactions() {
    const transactions: ITransaction[] = [];
    this.chain.forEach(block => {
      block.transactions.forEach((transaction: ITransaction) => {
        transactions.push(transaction);
      });
    });
    this.currentTransactions.forEach(transaction => {
      transactions.push(transaction);
    });
    return transactions;
  }

  getNonce(address = this.address) {
    let nonce = 0;
    const transactions = this.getAllTransactions();
    transactions.forEach(transaction => {
      if (transaction.sender === address) {
        nonce++;
      }
    });
    return nonce;
  }
}
