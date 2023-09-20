import connectMongoDB from "@/libs/mongodb";
import AccessPDA from "@/modals/AccessPDA";
import { NextResponse } from "next/server";

export async function POST(request:any) {
    const {
        buyer_name,
        seller_name,
        program_name,
        amount,
        program_id,
        buyer_pubkey,
        expires_at,
    } = await request.json();
    await connectMongoDB();

    await AccessPDA.create({
        buyer_name,
        seller_name,
        program_name,
        amount,
        program_id,
        buyer_pubkey,
        expires_at,
    });

    return NextResponse.json({message:"created access pda"}, {status:201});

}

export async function GET() {
    await connectMongoDB();
    const accessPDA = await AccessPDA.find();
    return NextResponse.json({accessPDA});
}