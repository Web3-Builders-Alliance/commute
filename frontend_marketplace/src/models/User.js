import mongoose, {Schema} from "mongoose";
import SellerProgram from "./SellerProgram";
import AccessPDA from "./AccessPDA";
const UserSchema = new Schema({
    name : String,
    seller_programs : [ {type: SellerProgram}],
    access_pda : [{type: AccessPDA}],
},
{
    timestamps:true,
}
);


const SellerProgram = mongoose.model.SellerProgram || mongoose.model("SellerProgram", sellerProgramSchema);

export default SellerProgram;