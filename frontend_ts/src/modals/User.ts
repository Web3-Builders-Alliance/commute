import mongoose, {Schema} from "mongoose";
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


const User = mongoose.model("User", UserSchema);

export default User;