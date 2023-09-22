'use client';
import React, { FC, useMemo } from 'react';
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import {PublicKey} from "@solana/web3.js";
import { SendSOL } from '@/components/SendSOL';
import { CreateSellerProgramButton } from '@/components/CreateSellerProgramButton';
import { CreateAccessPDA } from '@/components/CreateAccessPDA';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');


export default function Home() {
  return (
    <div >
      <WalletMultiButton />
      <WalletDisconnectButton/>
      < SendSOL />
      <br></br>
      {/* < CreateSellerProgramButton /> */}
      <br></br>
      < CreateAccessPDA />
      
    </div>
  )
}
