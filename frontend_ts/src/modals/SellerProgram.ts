import { Schema, model } from 'mongoose';

interface ISellerProgram {
    seller_name : String,
    program_name : String,
    program_description : String,
    program_id: String,
    seller_pubkey: String,
    amount: Number,
}

const sellerProgramSchema = new Schema<ISellerProgram>({
        seller_name : String,
        program_name : String,
        program_description : String,
        program_id: String,
        seller_pubkey: String,
        amount: Number,
    },
    {
        timestamps:true,
    }
);


const SellerProgram = model("SellerProgram", sellerProgramSchema);

export default SellerProgram;