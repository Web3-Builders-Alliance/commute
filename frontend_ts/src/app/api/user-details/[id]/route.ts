import connectMongoDB from "@/libs/mongodb";
import SellerProgram from "@/modals/SellerProgram";
import AccessPDA from "@/modals/AccessPDA";
import { NextResponse } from "next/server";

export async function GET(request:any, {params}:any) {
    const {id} = params;
    await connectMongoDB();
    const sellerProgram = await SellerProgram.find({seller_pubkey:id});
    const accessPDA = await AccessPDA.find({buyer_pubkey:id});
    return NextResponse.json({sellerProgram,accessPDA}, {status: 200});
}