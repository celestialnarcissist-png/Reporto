import mongoose, {Schema} from "mongoose"

const authoritySchema = new Schema({
   name:{
      type: String,
      required: true,
      trim: true,
      index: true
   },
   email:{
      type: String,
      required: true,
      unique:true,
      trim: true
   },
   password:{
      type: String,
      required: true ["Password is required"]
   },
   designation:{
      type: String,
      required: true
   },
   category:{
      type: String,
      required: true
   }
},
{timestamps: true})

export const Authority = mongoose.model("Authority", adminSchema)