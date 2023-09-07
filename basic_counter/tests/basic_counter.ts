import { Connection, Keypair, PublicKey, Commitment, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterAnchor, IDL } from "../target/types/counter_anchor";
const confirmTx = async (signature: string) => {
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
import assert from "assert";
const { SystemProgram } = anchor.web3;

describe('Counter Anchor Initialization', () => {
  const seller = new Keypair();
  anchor.setProvider(anchor.AnchorProvider.env());
  const programId = new PublicKey("GGfsrCPHdtCM1JT9YDrn463SiR6orGvyGtk6P63goCpr");
  const program = new anchor.Program<CounterAnchor>(IDL, programId,anchor.getProvider());
  const counterAccount = anchor.web3.Keypair.generate();
  const solAmount = 10 * LAMPORTS_PER_SOL;
  const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller")],program.programId)[0];
  const accessPda = PublicKey.findProgramAddressSync([Buffer.from("access")],program.programId)[0];
  
  it("Prefunds seller wallet with sol", async () => {
    await anchor.AnchorProvider.env().connection
      .requestAirdrop(seller.publicKey, solAmount)
      .then(confirmTx);
  });


  it('check for access pda and intialize!', async () => {
    await program.methods.initialize(programId)
    .accounts({
      counterAccount: counterAccount.publicKey,
        user: anchor.AnchorProvider.env().wallet.publicKey,
        systemProgram: SystemProgram.programId,
        accessPda: accessPda,
    })
    .signers([counterAccount])
    .rpc()
    .then(confirmTx);    
  });

  it('increase!', async () => {
    await program.methods.increase(new anchor.BN(1))
    .accounts({
      counterAccount: counterAccount.publicKey,
    })
    .rpc()
    .then(confirmTx);    
  });

});