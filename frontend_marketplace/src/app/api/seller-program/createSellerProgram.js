import { Connection, Keypair, PublicKey, Commitment, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import  IDL  from "../Programs/IDLMarketplaceProgram";
const confirmTx = async (signature) => {
  const latestBlockhash = await anchor
    .getProvider()
    .connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction(
    {
      signature,
      ...latestBlockhash,
    },
    "confirmed"
  );
  return signature;
};
const { SystemProgram } = anchor.web3;
const programId = new PublicKey("2zZpWQ35TqpTwKe9fYqp5hLMkEKXeX28Peb4vsbnUZNS");
// const seller_programId = new PublicKey("5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9");
const program = new anchor.Program(IDL, programId,anchor.getProvider());

const createSellerProgram = async(seller_programId, solAmount) => {
    await program.methods.initializeSellerProgram(seller_programId, new anchor.BN(solAmount))
    .accounts({
      seller:seller.publicKey,
      sellerProgram:sellerProgram,
      systemProgram : SystemProgram.programId,
    })
    .signers([seller])
    .rpc()
    .then(confirmTx);
}

export default createSellerProgram;