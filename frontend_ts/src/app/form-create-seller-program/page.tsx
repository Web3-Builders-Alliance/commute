"use client";
import { FormEvent, useState ,useCallback,FC } from "react";
import { useRouter } from "next/navigation";
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import {LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
const marketplaceProgramId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");

const preflightCommitment = "processed";
const commitment = "processed";



export default function FormCreateSellerProgram () {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useAnchorWallet();
    const router = useRouter();
    const [programName, setProgramName ] = useState("");
    const [programDescripton, setProgramDescripton ] = useState("");
    const [sellerProgramIdStr, setSellerProgramIdStr ] = useState("");
    const [amountInSolStr, setAmountInSolStr] = useState("");
    let amountInSol = 0;
    
    const createSellerProgram = async() => {
      if (!publicKey) throw new WalletNotConnectedError();
      const sellerProgramId = new PublicKey(sellerProgramIdStr); 
      const sellerProgram = PublicKey.findProgramAddressSync([Buffer.from("seller"),publicKey.toBuffer(), sellerProgramId.toBuffer()],marketplaceProgramId)[0];
  
      if (!wallet) {
      return;
      }
      const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment,
      commitment,
      });
      amountInSol = parseFloat(amountInSolStr);
      console.log(amountInSol);
  
      const program = new anchor.Program(IDL , marketplaceProgramId, provider);
      const amount = new anchor.BN(amountInSol*LAMPORTS_PER_SOL);
  
      const txn = await program.methods.initializeSellerProgram(sellerProgramId, amount)
      .accounts({
          seller:publicKey,
          sellerProgram:sellerProgram,
      })
      .rpc();
  
      console.log(txn);
      if(true){
          try {
          const res = await fetch("http://localhost:3000/api/seller-program", {
              method: "POST",
              headers: {
              "Content-type": "application/json",
              },
              body: JSON.stringify({
              program_name: programName,
              program_description: programDescripton,
              program_id : sellerProgramIdStr,
              seller_pubkey : publicKey.toBase58(),
              seller_program_pda: sellerProgram.toBase58(),
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
  
  }

    return(
            <div>
                <form onSubmit = {(event)=>{
                  event.preventDefault();
                  createSellerProgram();
            }} className="flex flex-col gap-3">
                <input
                onChange={(e) => {
                  setProgramName(e.target.value);
                  console.log(programName);
                }}
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
                onChange={(e) => setSellerProgramIdStr(e.target.value)}
                value={sellerProgramIdStr}
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
                {/* {displaySellerButton()} */}
                {/* <CreateSellerProgramButton programName="fkjdsfhakjshf" programDescripton ="fhdsfka fhdf haf " sellerProgramIdStr = "2PdpKUvetUDW7b8UtcvX42RLjm85VvVroXYZW5cU1mCd" amountInSol= {0.002} />  */}
                <button
                  type="submit"
                  className="bg-green-600 font-bold text-white py-3 px-6 w-fit"
                >
                  Create seller program
                </button>
                       
                
            </form>
            </div>
            
    )
}