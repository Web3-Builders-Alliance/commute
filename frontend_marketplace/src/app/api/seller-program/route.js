import connectMongoDB from "@libs/mongodb";
import SellerProgram from "@models/SellerProgram";
import { NextResponse } from "next/server";

export async function POST(request) {
    const {
        seller_name,
        program_id,
        seller_pubkey,
        amount,
        seller_program_bump
    } = await request.json();
    await connectMongoDB();

    await SellerProgram.create({
        seller_name,
        program_id,
        seller_pubkey,
        amount,
        seller_program_bump
    });

    return NextResponse.json({message:"created seller program"}, {status:201});

}

export async function GET() {
    await connectMongoDB();
    const sellerPrograms = await SellerProgram.find();
    return NextResponse.json({sellerPrograms});
}