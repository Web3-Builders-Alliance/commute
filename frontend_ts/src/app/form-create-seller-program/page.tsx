"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { IDLMarketplaceProgram, IDL } from "@/idl_marketplace/idl_marketplace";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
const marketplaceProgramId = new PublicKey(
  "8rNARYhUWKwzRx9QesdMBVeMJCJqqH6eH4sgtHseXpNr"
);

const preflightCommitment = "processed";
const commitment = "processed";

export default function FormCreateSellerProgram() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useAnchorWallet();
  const router = useRouter();
  const [programName, setProgramName] = useState("");
  const [programDescripton, setProgramDescripton] = useState("");
  const [sellerProgramIdStr, setSellerProgramIdStr] = useState("");
  const [amountInSolStr, setAmountInSolStr] = useState("");
  let amountInSol = 0;

  const createSellerProgram = async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    const sellerProgramId = new PublicKey(sellerProgramIdStr);
    const sellerProgram = PublicKey.findProgramAddressSync(
      [Buffer.from("seller"), publicKey.toBuffer(), sellerProgramId.toBuffer()],
      marketplaceProgramId
    )[0];

    if (!wallet) {
      return;
    }
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment,
      commitment,
    });
    amountInSol = parseFloat(amountInSolStr);
    console.log(amountInSol);

    const program = new anchor.Program(IDL, marketplaceProgramId, provider);
    const amount = new anchor.BN(amountInSol * LAMPORTS_PER_SOL);

    const txn = await program.methods
      .initializeSellerProgram(sellerProgramId, amount)
      .accounts({
        seller: publicKey,
        sellerProgram: sellerProgram,
      })
      .rpc();

    console.log(txn);
    if (txn) {
      try {
        const res = await fetch("http://localhost:3000/api/seller-program", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            program_name: programName,
            program_description: programDescripton,
            program_id: sellerProgramIdStr,
            seller_pubkey: publicKey.toBase58(),
            seller_program_pda: sellerProgram.toBase58(),
            amount: amountInSol,
          }),
        });

        if (res.ok) {
          router.push("/");
        } else {
          throw new Error("Failed to create a seller program");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <section className='w-full max-w-full flex-start flex-col ml-32 mb-10'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>Program Application Form</span>
      </h1>
      <p className='desc text-left max-w-md'>
        Complete the program application form, after user makes payment, user will gain access to your program, allowing them to interact with it.
      </p>


      <form
        onSubmit={(event) => {
          event.preventDefault();
          createSellerProgram();
        }}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Program Name
          </span>
          <input
            onChange={(e) => {
              setProgramName(e.target.value);
              console.log(programName);
            }}
            value={programName}
            type="text"
            placeholder="eg: Decryptor"
            className="form_input"
          />
        </label>

        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Program Description
          </span>
          <input
            onChange={(e) => setProgramDescripton(e.target.value)}
            value={programDescripton}
            type="text"
            placeholder="write your program info"
            className="form_input"
          />
        </label>

        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Program Id
          </span>
          <input
            onChange={(e) => setSellerProgramIdStr(e.target.value)}
            value={sellerProgramIdStr}
            className="form_input"
            type="text"
            placeholder="EtGf3KRU...sHtCeBXP17"
          />
        </label>
        
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Amount
          </span>
          <input
            onChange={(e) => setAmountInSolStr(e.target.value)}
            value={amountInSolStr}
            className="form_input"
            type="text"
            placeholder="Amount"
          />
        </label>
        {/* {displaySellerButton()} */}
        {/* <CreateSellerProgramButton programName="fkjdsfhakjshf" programDescripton ="fhdsfka fhdf haf " sellerProgramIdStr = "2PdpKUvetUDW7b8UtcvX42RLjm85VvVroXYZW5cU1mCd" amountInSol= {0.002} />  */}
        <button
          type="submit"
          className="font-bold bg-green-500 hover:bg-orange-400 text-white py-3 px-6 w-fit rounded"
        >
          Create seller program
        </button>
      </form>
    </section>
  );
}
