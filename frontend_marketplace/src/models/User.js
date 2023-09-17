import mongoose, {Schema} from "mongoose";
import SellerProgram from "./SellerProgram";
import AccessPDA from "./AccessPDA";
const UserSchema = new Schema({
    name : String,
    seller_programs : [ {
        program_name :String,
        amount: Number,
    }],
    access_pda : [{
        program_name :String,
        amount: Number,
    }],
},
{
    timestamps:true,
}
);


const SellerProgram = mongoose.model.SellerProgram || mongoose.model("SellerProgram", sellerProgramSchema);

export default SellerProgram;