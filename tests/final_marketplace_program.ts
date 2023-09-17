import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, Commitment, LAMPORTS_PER_SOL } from "@solana/web3.js";
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

describe("final_marketplace_program", () => {
  const buyer = new Keypair();
  console.log(`buyer : ${buyer.publicKey}`);
  const seller = new Keypair();
  console.log(`seller : ${seller.publicKey}`);
  anchor.setProvider(anchor.AnchorProvider.env());
  const programId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");
  const seller_programId = new PublicKey("5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9");
  const program = new anchor.Program<ProgramMarketplace>(IDL, programId,anchor.getProvider());
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
});
