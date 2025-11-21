import mongoose, {Schema} from "moongoose"


const reportSchema = new Schema({
   description:{
    type: String,
    required: true,
    trim: true
   },
   photos:{
    type: Object
   },
   reportedBy:{
    type: Schema.Types.ObjectId,
    ref: "User"
   },
   category:{
   type: String,
   required: true
   },
   location:{
      type: String,
      required: true
   },
   status:{
      type:String,
      required: true
   },
   priority:{
      type:String,
      required: true

   }
},
{timestamps: true}
)

export const Report = mongoose.model("Report", reportSchema)
