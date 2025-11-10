import mongoose, {Schema} from "moongoose"

const userSchema = new Schema({
   username:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
   },
   email:{
    type: String,
    required: true,
    index: true,
    unique: true,
    trim: true
   },
   fullname:{
    type:String,
    required: true,
    trim: true
   },
   report:[{
    type: Schema.types.ObjectId,
    ref: "Report"
   }],
   profilePhoto:{
      type: String // Cloudinary url
      required: true
   }


},{timestamps:true})

export const User = mongoose.model("User", userSchema)
