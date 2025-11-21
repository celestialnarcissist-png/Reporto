import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Report } from "../models/report.model.js";
import fetch from "node-fetch";

async function reverseGeocode(lat, lng) {
  const api = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${api}`;

  const res = await fetch(url);
  const data = await res.json();

  return data?.results?.[0]?.formatted_address || null;
}
const submitReport = asyncHandler(async (req, res) => {
  const { description, department, category, latitude, longitude } = req.body;

  if (
    [description, department, category, latitude, longitude].some(
      (fields) => fields?.trim() === ""
    )
  )
    throw new ApiError(401, "All fields are needed");

  const imagesFilePath = req.file?.path;
  let uploadImage;
  if (imagesFilePath) {
    uploadImage = await uploadOnCloudinary(imagesFilePath);
  } else {
    throw new ApiError(401, "No file path was found");
  }

  if (!uploadImage) throw new ApiError(500, "Image couldnt be uploaded");

  const address = await reverseGeocode(latitude, longitude);
  const report = await Report.create({
    description: description,
    user: req.user._id,
    image: { public_url: uploadImage.public_id, url: uploadImage.secure_url },
    status: "PENDING",
    priority: "LOW",

    category: category,
    location: { type: "Point", coordinates: [latitude, longitude] },
  });

  if (!report) throw new ApiError(500, "Report couldnt be created");

  return res
    .status(200)
    .json(new ApiResponse(200, "Report successfully posted"));
});

const updateDescription = asyncHandler(async (req, res) => {
  const { oldDescription, newDescription } = req.body;
  if ([oldDescription, newDescription].some((field) => field.trim() === ""))
    return new ApiError(
      401,
      "Both new description and old description is needed"
    );

  if (oldDescription === newDescription)
    return new ApiError(401, "Both are same ,no update is needed");
});
