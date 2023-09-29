"use client";
import {Transaction, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey,SystemProgram, VersionedTransaction, TransactionMessage} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import React, { FC, useCallback, useState } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useRouter } from "next/navigation";

const marketplaceProgramId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");



const preflightCommitment = "processed";
const commitment = "processed";

interface IAccessPDADetails  {
  programName : String,
  programDescripton : String,
  programId :string,
  sellerProgramIdStr: String,
  sellerPubkey : String,
  amountInSol: number
}


export const CreateAccessPDA: FC<IAccessPDADetails> = ({programName, programDescripton, programId, sellerProgramIdStr, sellerPubkey, amountInSol}:IAccessPDADetails) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const router = useRouter();
  const sellerProgramId = new PublicKey(programId);
  const to = new PublicKey(sellerPubkey);
  const [trialAccess, setTrialAccess] = useState(false);


  

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
      const fullAmount = new anchor.BN(amountInSol*LAMPORTS_PER_SOL);
      
      const trialAmount = new anchor.BN(amountInSol*LAMPORTS_PER_SOL*0.05);

      const sendSolTxn = SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: to,
            lamports : trialAccess?trialAmount:fullAmount,
        });
        console.log(trialAccess)
      const accessPdaTxn = await program.methods.initializeAccessPda(sellerProgramId, trialAccess)
      .accounts({
          buyer:publicKey,
          sellerProgram:sellerProgram,
          accessPda: accessPda,
          systemProgram : SystemProgram.programId,
      })
      .instruction();
      console.log(trialAccess);
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
              program_name: programName,
              amount : amountInSol*0.05,
              program_id : sellerProgramId.toBase58(),
              accessPDA : accessPda.toBase58(),
              buyer_pubkey: publicKey.toBase58(),
              expires_at: trialAccess?oneWeekFromNow:0
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
  }, [connection, publicKey, trialAccess]);

  return (
    <div>
        <label>
          <span className='font-satoshi font-bold text-base'>
              Trial Access
          </span>
          <input className="mx-4" type="checkbox" checked={trialAccess} onChange={(e)=>{
            setTrialAccess(!trialAccess);
            
          }}/>
        </label>
        {trialAccess? <h1>true</h1>:<h1>false</h1>}
        <br></br>
        <button 
        onClick={onClick} 
        disabled={!publicKey}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer my-2"
      >
          create access pda
      </button>
    </div>
      
  );
};
