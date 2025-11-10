import mongoose, {Schema} from "moongoose"


const reportSchema = new Schema({
   description:{
    type: String,
    required: true,
    trim: true
   },
   photos:{
    type: String
   },
   reportedBy:{
    type: Schema.type.ObjectId,
    ref: "User"
   }
},
{timestamps: true}
)

export const Report = mongoose.model("Report", reportSchema)
