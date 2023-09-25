// "use client";
// import {useState} from "react";
// import { useRouter } from "next/navigation";
// import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
// import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
// import * as anchor from "@coral-xyz/anchor";

// import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
// import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
// const marketplaceProgramId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");
// import React, { FC, useCallback } from 'react';


// const preflightCommitment = "processed";
// const commitment = "processed";

// export const CreateAccessPDA: FC<IAccessPDADetails> = ({programName, programDescripton, programId, sellerProgramIdStr, sellerPubkey, amountInSol}:IAccessPDADetails) => {
//     const { connection } = useConnection();
//     const { publicKey, sendTransaction } = useWallet();
//     const wallet = useAnchorWallet();
//     const router = useRouter();
//     const sellerProgramId = new PublicKey(programId);
//     const to = new PublicKey(sellerPubkey);
  
    
  
//     const onClick = useCallback(async () => {
      
      
//         if (!publicKey) throw new WalletNotConnectedError();
//         const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller"),to.toBuffer(), sellerProgramId.toBuffer()],marketplaceProgramId)[0];
//         console.log(`seller program : ${sellerProgram}`);
//         const accessPda = PublicKey.findProgramAddressSync([Buffer.from("access"), publicKey.toBuffer(), sellerProgramId.toBuffer()],marketplaceProgramId)[0];
//         console.log(`access pda : ${accessPda}`);
  
  
  
//         if (!wallet) {
//           return;
//         }
//         const provider = new anchor.AnchorProvider(connection, wallet, {
//           preflightCommitment,
//           commitment,
//         });
  
//         const program = new anchor.Program(IDL , marketplaceProgramId, provider);
  
//         const sendSolTxn = SystemProgram.transfer({
//               fromPubkey: publicKey,
//               toPubkey: to,
//               lamports : new anchor.BN(amountInSol*LAMPORTS_PER_SOL),
//           });
  
//           const accessPdaTxn = await program.methods.initializeAccessPda(sellerProgramId, true)
//           .accounts({
//               buyer:publicKey,
//               sellerProgram:sellerProgram,
//               accessPda: accessPda,
//               systemProgram : SystemProgram.programId,
//           })
//           .instruction();
//           console.log(accessPda);
//           const txn = new Transaction().add(sendSolTxn).add(accessPdaTxn); 
//           const sig = await sendTransaction(txn, connection);
//           await connection.confirmTransaction(sig);
  
  
//           if(sig){
//             try {
//               const currentDate = new Date();
  
//               // Calculate the date and time one week from now
//               const oneWeekFromNow = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
//               const res = await fetch("http://localhost:3000/api/access-pda", {
//                 method: "POST",
//                 headers: {
//                   "Content-type": "application/json",
//                 },
//                 body: JSON.stringify({
//                   program_name: programName,
//                   amount : amountInSol,
//                   program_id : sellerProgramId.toBase58(),
//                   accessPDA : accessPda.toBase58(),
//                   buyer_pubkey: publicKey.toBase58(),
//                   expires_at:oneWeekFromNow
//                 }),
//               });
        
//               if (res.ok) {
//                 router.push("/");
//               } else {
//                 throw new Error("Failed to create a topic");
//               }
//             } catch (error) {
//               console.log(error);
//             }
  
//           }
//     }, [connection, publicKey]);
  
//     return (
//         <button onClick={onClick} disabled={!publicKey}>
//             create access pda
//         </button>
//     );
//   };
  