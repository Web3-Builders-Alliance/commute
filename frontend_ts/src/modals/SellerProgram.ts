import { Schema, model, models } from 'mongoose';

interface ISellerProgram {
    program_name : String,
    program_description : String,
    program_id: String,
    seller_pubkey: String,
    seller_program_pda: String,
    amount: Number,
}

const sellerProgramSchema = new Schema<ISellerProgram>({
        program_name : String,
        program_description : String,
        program_id: String,
        seller_pubkey: String,
        seller_program_pda: String,
        amount: Number,
    },
    {
        timestamps:true,
    }
);


const SellerProgram = models.SellerProgram || model("SellerProgram", sellerProgramSchema);

export default SellerProgram;