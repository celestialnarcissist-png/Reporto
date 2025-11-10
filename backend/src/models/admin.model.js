import mongoose, {Schema} from "moongoose"

const adminSchema = new Schema (
    {
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
            unique: true,
            trim: true
        },
        password:{
            type: String,
            required: true, ["Password is required"]
        }
    },
    {timestamps:true}
)

export const Admin = mongoose.model("Admin", adminSchema)