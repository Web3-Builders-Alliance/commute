"use client";
import {PublicKey} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import React, { FC, useCallback } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useRouter } from "next/navigation";

const { SystemProgram } = anchor.web3;
const programId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");
const sellerProgramId = new PublicKey("5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9");


const preflightCommitment = "processed";
const commitment = "processed";


export const CreateSellerProgram: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const router = useRouter();
  

  const onClick = useCallback(async () => {
    
    
      if (!publicKey) throw new WalletNotConnectedError();
      const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller"),publicKey.toBuffer(), sellerProgramId.toBuffer()],programId)[0];

      if (!wallet) {
        return;
      }
      const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment,
        commitment,
      });

      const program = new anchor.Program(IDL , programId, provider);
      
      const txn = await program.methods.initializeSellerProgram(sellerProgramId, new anchor.BN(10000))
        .accounts({
          seller:publicKey,
          sellerProgram:sellerProgram,
          systemProgram : SystemProgram.programId,
        })
        .rpc();

        console.log(txn);
        if(txn){
          try {
            const res = await fetch("http://localhost:3000/api/seller-program", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                seller_name: "astro_boy",
                program_name: "counter",
                program_description: "this is a program about counters and and has functions to increase and decrease count",
                program_id: "5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9",
                seller_pubkey : "86nzka9Vi6A989Ej2L4LXf8zdqvVkistHntq28mbv4gF",
                amount : 10000,
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
          create sellerProgram
      </button>
  );
};
