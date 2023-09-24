import mongoose, {Schema} from "mongoose";
const UserSchema = new Schema({
    user_pubkey : String,
    seller_programs : [ {
        program_name :String,
        sellerProgram : String,
        amount: Number,
    }],
    access_pda : [{
        program_name :String,
        accessPDA : String,
        amount: Number,
    }],
},
{
    timestamps:true,
}
);


const User = mongoose.model("User", UserSchema);

export default User;