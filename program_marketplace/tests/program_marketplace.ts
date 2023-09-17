import { Connection, Keypair, PublicKey, Commitment, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProgramMarketplace, IDL } from "../target/types/program_marketplace";
import {CounterAnchor, IDL as COUNTER_IDL} from "../target/types/counter_anchor";
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
const { SystemProgram } = anchor.web3;

describe('setting seller program and access', () => {
  const buyer = new Keypair();
  console.log(`buyer : ${buyer.publicKey}`);
  const seller = new Keypair();
  console.log(`seller : ${seller.publicKey}`);
  const counterAccount = anchor.web3.Keypair.generate();
  anchor.setProvider(anchor.AnchorProvider.env());
  const programId = new PublicKey("2zZpWQ35TqpTwKe9fYqp5hLMkEKXeX28Peb4vsbnUZNS");
  const seller_programId = new PublicKey("5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9");
  const program = new anchor.Program<ProgramMarketplace>(IDL, programId,anchor.getProvider());
  const counter_program = new anchor.Program<CounterAnchor>(COUNTER_IDL, seller_programId,anchor.getProvider());
  const solAmount = 10 * LAMPORTS_PER_SOL;
  const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller"),seller.publicKey.toBuffer(), seller_programId.toBuffer()],program.programId)[0];
  const accessPda = PublicKey.findProgramAddressSync([Buffer.from("access"), buyer.publicKey.toBuffer(), seller_programId.toBuffer()],program.programId)[0];

  
  it("Prefunds seller wallet with sol", async () => {
    await anchor.AnchorProvider.env().connection
      .requestAirdrop(seller.publicKey, solAmount)
      .then(confirmTx);
  });
  it('initialise seller program!', async () => {
    await program.methods.initializeSellerProgram(seller_programId, new anchor.BN(solAmount))
    .accounts({
      seller:seller.publicKey,
      sellerProgram:sellerProgram,
      systemProgram : SystemProgram.programId,
    })
    .signers([seller])
    .rpc()
    .then(confirmTx);    
  });

  it("Prefunds buyer wallet with sol", async () => {
    await anchor.AnchorProvider.env().connection
      .requestAirdrop(buyer.publicKey, solAmount)
      .then(confirmTx);
  });

  it('initialise access pda!', async () => {
    await program.methods.initializeAccessPda(seller_programId, true)
    .accounts({
      buyer: buyer.publicKey,
      sellerProgram:sellerProgram,
      accessPda:accessPda,
    })
    .signers([buyer])
    .rpc()
    .then(confirmTx);    
  });

  it('check for access pda and intialize!', async () => {
    await counter_program.methods.initialize(programId)
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
  it('increase1!', async () => {
    await counter_program.methods.increase(new anchor.BN(1))
    .accounts({
      counterAccount: counterAccount.publicKey,
      accessPda: accessPda,
    })
    .rpc()
    .then(confirmTx);    
  });
  it('increase2!', async () => {
    await counter_program.methods.increase(new anchor.BN(1))
    .accounts({
      counterAccount: counterAccount.publicKey,
      accessPda: accessPda,
    })
    .rpc()
    .then(confirmTx);    
  });
  it('close account!', async () => {
    await program.methods.closeExpiredAccess()
    .accounts({
      closer: buyer.publicKey,
      accessPda: accessPda,
    })
    .signers([buyer])
    .rpc()
    .then(confirmTx);    
  });

  it('increase3!', async () => {
    await counter_program.methods.increase(new anchor.BN(1))
    .accounts({
      counterAccount: counterAccount.publicKey,
      accessPda: accessPda,
    })
    .rpc()
    .then(confirmTx);    
  });
});