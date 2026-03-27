import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required:[true,"User Name is Required"]
  },
  password:{
    type:String,
    required:[true,"Password is required"],
  select:false  },
   salt:{
    type:String,
    select:false
  },
  profilePicture:{
    type:String,
    default:"profilePicture.png"
  },
  bio:{
    type:String,
    required:false,
    default:" no bio"
  },
  isDeleted:{
    type:Boolean,
    default:false
  }

},{timestamps:true}
);
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }})
const User=mongoose.model("User",userSchema);
export default User;