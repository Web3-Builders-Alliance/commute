"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';


const Navbar = () => {
  const isUserConnected = false;

  const handleSignIn = async () => {
    const msg = "sign in - commute";
  }

  return (
    <nav className="flex-between w-full mb-16 pt-3 m-2">
      <Link href="/" className="flex gap-2 flex-center">
        <Image 
          src="/assets/images/commute-logo.png"
          alt="Commute Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Commute</p>
      </Link>

      {/* {Desktoop Navigation} */}
      <div className="sm:flex hidden">
            <WalletMultiButton className=""/>
      </div>
    </nav>
  )
}

export default Navbar