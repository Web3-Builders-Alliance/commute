import mongoose, {Schema} from "mongoose";


const AccessPDASchema = new Schema({
        buyer_name : String,
        seller_name : String,
        amount: Number,
        program_id: String,
        buyer_pubkey : String,      
        access_pda_bump:Number, 
        expires_at : Date,
    },
    {
        timestamps:true,
    }
);


const AccessPDA = mongoose.model.AccessPDA || mongoose.model("AccessPDA", AccessPDASchema);

export default AccessPDA;