import test from "ava";
import BlockChain from "../../blockchain/blockchainApp";
import keypair from "keypair";
import { multisigInfo } from "../../blockchain/interface";
import { typeRPC } from "../../blockchain/responder";
var aes256 = require("aes256");

main();

async function main() {
  //マルチシグトランザクションを作る役(作成役とする)
  const bc1 = new BlockChain();

  //シェアキー共有者
  const friends = [];

  const cypher = keypair();
  friends.push(aes256.encrypt("format", cypher.public));
  //承認者１
  const bc2 = new BlockChain(cypher.private, cypher.public);

  const cypher2 = keypair();
  friends.push(aes256.encrypt("format", cypher2.public));
  //承認者２
  const bc3 = new BlockChain(cypher2.private, cypher2.public);

  //作成役がマイニングしてトークンを稼ぐ
  const block = await bc1.mine();
  console.log({ block });
  console.log("amount", bc1.address, bc1.nowAmount(bc1.address));

  //作成役と承認者のブロックチェーンのフォークを解決
  bc2.chain = bc1.chain;
  bc3.chain = bc1.chain;

  bc1.multisig.events.onMultisigTranDone["test multisig"] = () => {
    console.log("multisig test done");
    test("multisig", test => {
      test.pass();
    });
  };

  //承認者が承認するためのコールバックを用意
  bc2.multisig.events.onMultisigTran["test approve"] = (info: multisigInfo) => {
    const tran = bc2.multisig.approveMultiSig(info);
    //マルチシグの承認
    if (tran) bc1.responder.runRPC({ type: typeRPC.TRANSACRION, body: tran });
  };
  bc3.multisig.events.onMultisigTran["test approve"] = (info: multisigInfo) => {
    const tran = bc3.multisig.approveMultiSig(info);
    if (tran) bc1.responder.runRPC({ type: typeRPC.TRANSACRION, body: tran });
  };

  //作成役がマルチシグアドレスを生成
  let tran: any = bc1.multisig.makeNewMultiSigAddress(friends, 3, 1);

  //承認者がマルチシグアドレスのトランザクションをresponderに渡す
  bc2.responder.runRPC({ type: typeRPC.TRANSACRION, body: tran });
  bc3.responder.runRPC({ type: typeRPC.TRANSACRION, body: tran });

  const multisigAddress = Object.keys(bc1.multisig.multiSig)[0];
  //マルチシグトランザクションを作成
  tran = bc1.multisig.makeMultiSigTransaction(multisigAddress);

  //マルチシグトランザクションをresponderに渡す。
  if (tran) bc2.responder.runRPC({ type: typeRPC.TRANSACRION, body: tran });
  if (tran) bc3.responder.runRPC({ type: typeRPC.TRANSACRION, body: tran });
}
