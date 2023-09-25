import { Schema, model, models } from 'mongoose';

interface IAccessPDA {
        program_name : String,
        amount: Number,
        program_id: String,
        accessPDA: String,
        buyer_pubkey : String,      
        expires_at : Date,
}

const AccessPDASchema = new Schema<IAccessPDA>({
        program_name : String,
        amount: Number,
        program_id: String,
        buyer_pubkey : String,
        accessPDA: String,
        expires_at : Date,
    },
    {
        timestamps:true,
    }
);


const AccessPDA = models.AccessPDA || model("AccessPDA", AccessPDASchema);

export default AccessPDA;