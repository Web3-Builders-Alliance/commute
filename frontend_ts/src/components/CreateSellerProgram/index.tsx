"use client";
import {PublicKey} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import React, { FC, useCallback } from 'react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';


const { SystemProgram } = anchor.web3;
const programId = new PublicKey("8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr");
const sellerProgramId = new PublicKey("5ctVKdDrrPhvrpEH2zat86QHeEk2r1ayUJFSu4Gui9k9");


const preflightCommitment = "processed";
const commitment = "processed";


export const CreateSellerProgram: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  

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
  }, [connection, publicKey]);

  return (
      <button onClick={onClick} disabled={!publicKey}>
          create sellerProgram
      </button>
  );
};


// const createSellerProgram = async(seller_pubkey : string,seller_programId: string, solAmount: number) => {
//     await program.methods.initializeSellerProgram(seller_programId, new anchor.BN(solAmount))
//     .accounts({
//       seller:seller_pubkey,
//       sellerProgram:seller_programId,
//       systemProgram : SystemProgram.programId,
//     })
//     .signers([seller])
//     .rpc()
//     .then(confirmTx);
// }

// export default createSellerProgram;