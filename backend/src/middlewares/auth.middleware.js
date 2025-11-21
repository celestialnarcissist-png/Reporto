import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookie.accessToken ||
    req.header("Authorization").replace("Bearer ", "");

  if (!accessToken) return new ApiError(401, "No access Token needed");
  const userDetails = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(userDetails?._id).select(
    "-password -refreshToken"
  );

  if (!user) return new ApiError(401, "No such user found: UnAuthoized Access");

  req.user = user;
  next();
});

export { verifyJWT };
