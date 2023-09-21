"use client";
import { FormEvent, useState ,useCallback } from "react";
import { useRouter } from "next/navigation";
import { createSellerProgram } from "@/hooks/createSellerProgram";
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
const programId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");

const preflightCommitment = "processed";
const commitment = "processed";

export default function FormCreateSellerProgram () {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useAnchorWallet();
    const router = useRouter();
    const [programName, setProgramName ] = useState("");
    const [programDescripton, setProgramDescripton ] = useState("");
    const [sellerProgramId, setSellerProgramId ] = useState("");
    const [amountInSolStr, setAmountInSolStr] = useState("");
    let amountInSol = 0;
    // const onClick = useCallback(async () => {
    //     amountInSol = parseInt(amountInSolStr);
    
    //     if (!programName || !programDescripton || !sellerProgramId || !amountInSol) {
    //       alert("Fill all the details in the form.");
    //       return;
    //     }

    //     await createSellerProgram(programName, programDescripton,sellerProgramId,amountInSol);

    // }, [connection, publicKey]);

    const onClick = useCallback(async () => {
    
    
        if (!publicKey) throw new WalletNotConnectedError();
        const sellerProgram_Id = new PublicKey(sellerProgramId);
        const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller"),publicKey.toBuffer(), sellerProgram_Id.toBuffer()],programId)[0];
        amountInSol = parseInt(amountInSolStr);
  
        if (!wallet) {
          return;
        }
        const provider = new anchor.AnchorProvider(connection, wallet, {
          preflightCommitment,
          commitment,
        });
  
        const program = new anchor.Program(IDL , programId, provider);
        
        const txn = await program.methods.initializeSellerProgram(sellerProgram_Id, new anchor.BN(amountInSol*LAMPORTS_PER_SOL))
          .accounts({
            seller:publicKey,
            sellerProgram:sellerProgram,
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
                  program_name: programName,
                  program_description: programDescripton,
                  program_id: sellerProgram_Id,
                  seller_pubkey : publicKey,
                  amount : amountInSol,
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

    return(
            <div>
                <WalletMultiButton />
                <WalletDisconnectButton/>
                <form className="flex flex-col gap-3">
                <input
                onChange={(e) => setProgramName(e.target.value)}
                value={programName}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Program Title"
                />
        
                <input
                onChange={(e) => setProgramDescripton(e.target.value)}
                value={programDescripton}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Program Description"
                />
                <input
                onChange={(e) => setSellerProgramId(e.target.value)}
                value={sellerProgramId}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Program Id"
                />
                <input
                onChange={(e) => setAmountInSolStr(e.target.value)}
                value={amountInSolStr}
                className="border border-slate-500 px-8 py-2"
                type="text"
                placeholder="Amount"
                />
        
                <button
                onClick={onClick} disabled={!publicKey}
                className="bg-green-600 font-bold text-white py-3 px-6 w-fit"
                >
                Create Seller Program
                </button>
            </form>
            </div>
            
    )
}