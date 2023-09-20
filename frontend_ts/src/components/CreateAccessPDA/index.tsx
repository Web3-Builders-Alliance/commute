"use client";
import {Transaction, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey,SystemProgram, VersionedTransaction, TransactionMessage} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import React, { FC, useCallback } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useRouter } from "next/navigation";

const programId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");
const sellerProgramId = new PublicKey("5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9");
const to = new PublicKey("86nzka9Vi6A989Ej2L4LXf8zdqvVkistHntq28mbv4gF")
const amount  = 10_000;

const preflightCommitment = "processed";
const commitment = "processed";


export const CreateAccessPDA: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const router = useRouter();
  

  const onClick = useCallback(async () => {
    
    
      if (!publicKey) throw new WalletNotConnectedError();
      const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller"),to.toBuffer(), sellerProgramId.toBuffer()],programId)[0];
      console.log(`seller program : ${sellerProgram}`);
      const accessPda = PublicKey.findProgramAddressSync([Buffer.from("access"), publicKey.toBuffer(), sellerProgramId.toBuffer()],programId)[0];
      console.log(`access pda : ${accessPda}`);



      if (!wallet) {
        return;
      }
      const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment,
        commitment,
      });

      const program = new anchor.Program(IDL , programId, provider);

      const sendSolTxn = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: to,
            lamports : amount,
        });

        const accessPdaTxn = await program.methods.initializeAccessPda(sellerProgramId, true)
        .accounts({
            buyer:publicKey,
            sellerProgram:sellerProgram,
            accessPda: accessPda,
            systemProgram : SystemProgram.programId,
        })
        .instruction();
        console.log(accessPda);
        const txn = new Transaction().add(sendSolTxn).add(accessPdaTxn); 
        const sig = await sendTransaction(txn, connection);
        await connection.confirmTransaction(sig);


        if(sig){
          try {
            const currentDate = new Date();

            // Calculate the date and time one week from now
            const oneWeekFromNow = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            const res = await fetch("http://localhost:3000/api/access-pda", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                buyer_name:"xyz2",
                seller_name:"abc2",
                program_name: "counter",
                amount,
                program_id : "5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9",
                buyer_pubkey: "7wxVFNuK35shzgrF1wjdrTmfkUd3SSkRCXrZqxYjQVDX", 
                expires_at:oneWeekFromNow
              }),
            });
      
            if (res.ok) {
              router.push("/");
            } else {
              throw new Error("Failed to create a topic");
            }
          } catch (error) {
            console.log(error);
          }

        }
  }, [connection, publicKey]);

  return (
      <button onClick={onClick} disabled={!publicKey}>
          create access pda
      </button>
  );
};
