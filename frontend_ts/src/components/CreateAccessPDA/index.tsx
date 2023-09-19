"use client";
import {Transaction, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import React, { FC, useCallback } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useRouter } from "next/navigation";

const { SystemProgram } = anchor.web3;
const programId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");
const sellerProgramId = new PublicKey("3rsPxsbTmWS7fci9w4JhBkgVFb5NZ9NueE6Jj7dzD2yh");
const to = new PublicKey("7wxVFNuK35shzgrF1wjdrTmfkUd3SSkRCXrZqxYjQVDX")
const amount  = new anchor.BN(10);

const preflightCommitment = "processed";
const commitment = "processed";


export const CreateAccessPDA: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const router = useRouter();
  

  const onClick = useCallback(async () => {
    
    
      if (!publicKey) throw new WalletNotConnectedError();
      const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller"),publicKey.toBuffer(), sellerProgramId.toBuffer()],programId)[0];
      const accessPda = PublicKey.findProgramAddressSync([Buffer.from("access"), publicKey.toBuffer(), sellerProgramId.toBuffer()],programId)[0];

      if (!wallet) {
        return;
      }
      const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment,
        commitment,
      });

      const program = new anchor.Program(IDL , programId, provider);
      let sendSolTxn = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey:publicKey,
            toPubkey:to,
            lamports:amount,
        })
        );
        sendSolTxn.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        sendSolTxn.feePayer = publicKey;
        const sendSolSignature = await sendTransaction(sendSolTxn,connection);

      if(sendSolSignature){
        const accessPdaTxn = await program.methods.initializeAccessPda(sellerProgramId, true)
        .accounts({
          buyer:publicKey,
          sellerProgram:sellerProgram,
          accessPda: accessPda
        })
        .rpc();

        console.log(accessPdaTxn);
      }

        // if(accessPdaTxn){
        //   try {
        //     const res = await fetch("http://localhost:3000/api/access-pda", {
        //       method: "POST",
        //       headers: {
        //         "Content-type": "application/json",
        //       },
        //       body: JSON.stringify({
        //         seller_name: "astro_boy",
        //         program_name: "counter",
        //         program_description: "this is a program about counters and and has functions to increase and decrease count",
        //         programId,
        //         publicKey,
        //         amount : 10000,
        //       }),
        //     });
      
        //     if (res.ok) {
        //       router.push("/");
        //     } else {
        //       throw new Error("Failed to create a topic");
        //     }
        //   } catch (error) {
        //     console.log(error);
        //   }

        // }
  }, [connection, publicKey]);

  return (
      <button onClick={onClick} disabled={!publicKey}>
          create access pda
      </button>
  );
};
