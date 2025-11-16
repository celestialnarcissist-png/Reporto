import mongoose, {Schema} from "mongoose"
  
const csrSchema = new Schema({
     companyName:{
        type: String,
        required: true,
        unique: true,
        trim: true
     },
     companyEmail:{
       type: String,
       required: true,
       unique: true
     },
     companyDescription:{
        type: String,
        required: true
     },
     donations:{
       type: String,
       required: true
     },
     issuesResolved:[
        report:{
            type: Schema.types.ObjectId,
            ref: "Report"
        }
     ],
     companyProfilePhoto:{
        type: String,
        required: true
     }
     },
    {timestamps:true}
)

export const Csr = mongoose.model("Csr", csrSchema)