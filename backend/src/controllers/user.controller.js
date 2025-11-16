import {User} from "../models/user.model"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { ApiError } from "../utils/apiError"
import { ApiResponse } from "../utils/apiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { uploadOnCloudinary } from "../utils/cloudinary"

// generate access and refresh token

// register user
const registerUser = asyncHandler(async (req,res) => {

    // take all the fields input
    const {fullName,username,email,password} = req.body
    
    // check if they are empty and throw error
    if ([fullName,username,email,password].some((fields) => fields.trim() === " ")){
        throw new ApiError( 400"All fields are required")
    }
    
    // find if a user already exists with same credentials
    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(400, "User already exists")
    }

    
    // get profile photo
    const profilePhotoPath = req.files?.path

    if(!profilePhotoPath){
        throw new ApiError(400, "Profile photo is required")
    }
    
    // upload them on cloud
    const profilePhoto = uploadOnCloudinary(profilePhotoPath)

    const uploadedProfilePhoto = {
        url: profilePhoto.secure_url,
        public_id: profilePhoto.public_id
    }
    
    // create user
    const createdUser = await User.create{
        fullName,
        username,
        profilePhoto: uploadedProfilePhoto,
        email,
        password
    }
    
    //check if user is created successfully or throw error
    if(!createdUser){
        throw(404, "Error creating profile")
    }

    // return success response
    return res
    .status(201)
    .json(
        new ApiResponse(200,createdUser, "User created successfully")
    )

})









// login user
// take login credentials
// validate password or throw invalid error
// find user from credentials
// match them 
// generate access and refresh token
// create  
