import connectMongoDB from "@/libs/mongodb";
import SellerProgram from "@/modals/SellerProgram";
import { NextResponse } from "next/server";

export async function GET(request:any, {params}:any) {
    const {id} = params;
    await connectMongoDB();
    const sellerProgram = await SellerProgram.findOne({_id:id});
    return NextResponse.json({sellerProgram}, {status: 200});
}