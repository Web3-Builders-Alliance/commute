import connectMongoDB from "@/libs/mongodb";
import AccessPDA from "@/modals/AccessPDA";
import { NextResponse } from "next/server";

export async function POST(request:any) {
    const {
        program_name,
        amount,
        program_id,
        accessPDA,
        buyer_pubkey,
        expires_at,
    } = await request.json();
    await connectMongoDB();

    await AccessPDA.create({
        program_name,
        amount,
        program_id,
        accessPDA,
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

export async function DELETE(request: any) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await AccessPDA.findByIdAndDelete(id);
    return NextResponse.json({ message: "access pda deleted" }, { status: 200 });
  }