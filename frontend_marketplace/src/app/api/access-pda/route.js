import connectMongoDB from "@libs/mongodb";
import AccessPDA from "@models/AccessPDA";
import { NextResponse } from "next/server";

export async function POST(request) {
    const {
        buyer_name,
        seller_name,
        amount,
        program_id,
        buyer_pubkey,      
        access_pda_bump, 
        expires_at,
    } = await request.json();
    await connectMongoDB();

    await AccessPDA.create({
        buyer_name,
        seller_name,
        amount,
        program_id,
        buyer_pubkey,      
        access_pda_bump, 
        expires_at,
    });

    return NextResponse.json({message:"created seller program"}, {status:201});

}

export async function GET() {
    await connectMongoDB();
    const accessPDA = await AccessPDA.find();
    return NextResponse.json({accessPDA});
}