"use client"
import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import React, { FC, useCallback } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useRouter } from "next/navigation";

const { SystemProgram } = anchor.web3;
const marketplaceProgramId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");
// const sellerProgramId = new PublicKey("5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9");


const preflightCommitment = "processed";
const commitment = "processed";


export const createSellerProgram = async(program_name:string, program_description: string, seller_programId : string, amount : number) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useAnchorWallet();
    const router = useRouter();

    if (!publicKey) throw new WalletNotConnectedError();
    const sellerProgramId = new PublicKey(seller_programId);
    const programId = new PublicKey(sellerProgramId); 
    const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller"),publicKey.toBuffer(), sellerProgramId.toBuffer()],marketplaceProgramId)[0];

    if (!wallet) {
    return;
    }
    const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment,
    commitment,
    });

    const program = new anchor.Program(IDL , marketplaceProgramId, provider);
    

    const txn = await program.methods.initializeSellerProgram(sellerProgramId, new anchor.BN(amount*LAMPORTS_PER_SOL))
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
            program_name: program_name,
            program_description: program_description,
            program_id : programId,
            seller_pubkey : publicKey,
            amount,
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

}