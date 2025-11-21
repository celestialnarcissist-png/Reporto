import mongoose, { Schema } from "moongoose";

const reportSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    photos: {
      type: Object,
    },
    reportedBy: {
      type: Schema.type.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
