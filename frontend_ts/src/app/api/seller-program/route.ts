import connectMongoDB from "@/libs/mongodb";
import { Connection, Keypair, PublicKey, Commitment, LAMPORTS_PER_SOL } from "@solana/web3.js";
import SellerProgram from "@/modals/SellerProgram";
import { NextResponse } from "next/server";

export async function POST(request : any) {
    
    const {
        seller_name,
        program_name,
        program_description,
        program_id,
        seller_pubkey,
        amount,
        
    } = await request.json();
    await connectMongoDB();

    // const seller_programId = new PublicKey(program_id);
    // const solAmount = amount * LAMPORTS_PER_SOL;

    // await createSellerProgram(seller_programId,solAmount);

    await SellerProgram.create({
        seller_name,
        program_name,
        program_description,
        program_id,
        seller_pubkey,
        amount,
        
    });

    return NextResponse.json({message:"created seller program"}, {status:201});

}

export async function GET() {
    await connectMongoDB();
    const sellerPrograms = await SellerProgram.find();
    return NextResponse.json({sellerPrograms});
}