import {PublicKey} from "@solana/web3.js";
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
const programId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");
const program = new anchor.Program(IDL, programId,anchor.getProvider());

const createSellerProgram = async(seller_pubkey,seller_programId, solAmount) => {
    await program.methods.initializeSellerProgram(seller_programId, new anchor.BN(solAmount))
    .accounts({
      seller:seller_pubkey,
      sellerProgram:seller_programId,
      systemProgram : SystemProgram.programId,
    })
    .signers([seller])
    .rpc()
    .then(confirmTx);
}

export default createSellerProgram;