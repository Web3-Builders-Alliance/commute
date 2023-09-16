import mongoose, {Schema} from "mongoose";

const sellerProgramSchema = new Schema({
        seller_name : String,
        program_id: String,
        seller_pubkey: String,
        amount: Number,
        seller_program_bump: Number
    },
    {
        timestamps:true,
    }
);


const SellerProgram = mongoose.model.SellerProgram || mongoose.model("SellerProgram", sellerProgramSchema);

export default SellerProgram;