'use client';
import Link from "next/link";

import React, { FC, useMemo } from 'react';
import { useConnection, useWallet, useAnchorWallet} from '@solana/wallet-adapter-react';
import {PublicKey} from "@solana/web3.js";
import { SendSOL } from '@/components/SendSOL';
import { CreateSellerProgramButton } from '@/components/CreateSellerProgramButton';
import { CreateAccessPDA } from '@/components/CreateAccessPDA';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');


export default function Home() {
  const {publicKey} = useWallet();
  
  return (
    <div className="m-3">
      <Link href={`/seller-program`}>
          seller program list
      </Link>
      <br></br>
      <Link href={`/form-create-seller-program`}>
          create seller program
      </Link>
      <br></br>
      <Link href={`/user-details/${publicKey}`}>
          user details
      </Link>
      {/* < SendSOL /> */}
      <br></br>
      {/* < CreateSellerProgramButton /> */}
      <br></br>
      {/* < CreateAccessPDA /> */}
      
    </div>
  )
}
