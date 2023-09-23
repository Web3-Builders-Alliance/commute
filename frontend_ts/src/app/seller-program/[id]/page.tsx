"use client"
import {Transaction, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey,SystemProgram, VersionedTransaction, TransactionMessage} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import React, { FC, useCallback } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useRouter } from "next/navigation";

const marketplaceProgramId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");

const preflightCommitment = "processed";
const commitment = "processed";


const getSellerProgramById = async (id:any) => {
    try {
        const res = await fetch(`http://localhost:3000/api/seller-program/${id}`, {cache:"no-store"});
        if (!res.ok) {
            throw new Error("Failed to fetch seller");
        }
        return res.json(); 

    } catch (error) {
        console.log(error);
    }
}

export default async function BuySellerProgram({params}:any) {
    const {id} = params;
    console.log(id);
    const {sellerProgram} = await getSellerProgramById(id);
    const {program_name, program_description, program_id, seller_pubkey, seller_program_pda, amount} = sellerProgram;
    const sellerProgramId = new PublicKey(program_id);
    const to = new PublicKey(seller_pubkey);
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useAnchorWallet();
    const router = useRouter();
    const onClick = useCallback(async () => {

        if (!publicKey) throw new WalletNotConnectedError();
        const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller"),to.toBuffer(), sellerProgramId.toBuffer()],marketplaceProgramId)[0];
        console.log(`seller program : ${sellerProgram}`);
        const accessPda = PublicKey.findProgramAddressSync([Buffer.from("access"), publicKey.toBuffer(), sellerProgramId.toBuffer()],marketplaceProgramId)[0];
        console.log(`access pda : ${accessPda}`);

        if (!wallet) {
          return;
        }
        const provider = new anchor.AnchorProvider(connection, wallet, {
          preflightCommitment,
          commitment,
        });
  
        const program = new anchor.Program(IDL , marketplaceProgramId, provider);
  
        const sendSolTxn = SystemProgram.transfer({
              fromPubkey: publicKey,
              toPubkey: to,
              lamports : new anchor.BN(amount*LAMPORTS_PER_SOL),
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
                  program_name: program_name,
                  amount,
                  program_id : program_id,
                  buyer_pubkey: publicKey.toBase58(),
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
            <div className="border border-black m-2 p-4">
                <div className="flex justify-between">
                    <h2>program name : {program_name}</h2>
                    <h2>amount : {amount}</h2>
                </div>
                <p>program id : {program_id}</p>
                <br></br>
                <p>description : {program_description}</p>
                <button onClick={onClick} disabled={!publicKey}>
                    buy access pda
                </button>

            </div>

        
    )
    
}