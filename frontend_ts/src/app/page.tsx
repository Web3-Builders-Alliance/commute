'use client';
import React, { FC, useMemo } from 'react';
import {
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import {PublicKey} from "@solana/web3.js";
import { SendSOL } from '@/components/SendSOL';
import { CreateSellerProgram } from '@/components/CreateSellerProgram';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');


export default function Home() {
  return (
    <div >
      <h1 className='text-2xl'>market place</h1>
      <WalletMultiButton />
      <WalletDisconnectButton/>
      < SendSOL />
      <br></br>
      < CreateSellerProgram />
      
    </div>
  )
}
