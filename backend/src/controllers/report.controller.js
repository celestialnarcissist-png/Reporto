import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Report } from "../models/report.model.js";

const submitReport = asyncHandler(async (req, res) => {
  const { description, department, category } = req.body;

  if (
    [description, department, category].some((fields) => fields?.trim() === "")
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

  const report = await Report.create({
    description: description,
    user: req.user._id,
    image: { public_url: uploadImage.public_id, url: uploadImage.secure_url },
    status: "PENDING",
    priority: "LOW",
    location: "Dummy",
    category: category,
  });

  if (!report) throw new ApiError(500, "Report couldnt be created");

  return res
    .status(200)
    .json(new ApiResponse(200, "Report successfully posted"));
});
