import { Connection, Keypair, PublicKey, Commitment, LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ProgramMarketplace, IDL } from "../target/types/program_marketplace";
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
  console.log(`buyer : ${buyer.secretKey}`);
  const seller = new Keypair();
  console.log(`seller : ${seller.secretKey}`);
  anchor.setProvider(anchor.AnchorProvider.env());
  const programId = new PublicKey("2zZpWQ35TqpTwKe9fYqp5hLMkEKXeX28Peb4vsbnUZNS");
  const seller_programId = new PublicKey("GGfsrCPHdtCM1JT9YDrn463SiR6orGvyGtk6P63goCpr");
  const program = new anchor.Program<ProgramMarketplace>(IDL, programId,anchor.getProvider());
  const solAmount = 10 * LAMPORTS_PER_SOL;
  const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller")],program.programId)[0];
  const accessPda = PublicKey.findProgramAddressSync([Buffer.from("access")],program.programId)[0];

  
  it("Prefunds seller wallet with sol", async () => {
    await anchor.AnchorProvider.env().connection
      .requestAirdrop(seller.publicKey, solAmount)
      .then(confirmTx);
  });
  it('initialise seller program!', async () => {
    await program.methods.initializeSellerProgram(seller_programId)
    .accounts({
      seller:seller.publicKey,
      sellerProgram:sellerProgram,
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
    await program.methods.initializeAccessPda(seller_programId)
    .accounts({
      buyer: buyer.publicKey,
      sellerProgram:sellerProgram,
      accessPda:accessPda,
    })
    .signers([buyer])
    .rpc()
    .then(confirmTx);    
  });

  
});