import { Schema, model } from 'mongoose';

interface IAccessPDA {
    buyer_name : String,
        seller_name : String,
        program_name : String,
        amount: Number,
        program_id: String,
        buyer_pubkey : String,      
        access_pda_bump:Number, 
        expires_at : Date,
}

const AccessPDASchema = new Schema<IAccessPDA>({
        buyer_name : String,
        seller_name : String,
        program_name : String,
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


const AccessPDA = model("AccessPDA", AccessPDASchema);

export default AccessPDA;