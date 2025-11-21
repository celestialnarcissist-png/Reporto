import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

// generate access and refresh token
const generateAccessAndRefreshToken = async(userId) {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(400,"Error creating refresh and access token")
    }
}

// register user
const registerUser = asyncHandler(async (req, res) => {
  // take all the fields input
  const { fullName, username, email, password } = req.body;

  // check if they are empty and throw error
  if (
    [fullName, username, email, password].some(
      (fields) => fields.trim() === " "
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // find if a user already exists with same credentials
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  // get profile photo
  const profilePhotoPath = req.files?.path;

  if (!profilePhotoPath) {
    throw new ApiError(400, "Profile photo is required");
  }

  // upload them on cloud
  const profilePhoto = uploadOnCloudinary(profilePhotoPath);

  const uploadedProfilePhoto = {
    url: profilePhoto.secure_url,
    public_id: profilePhoto.public_id,
  };

  // create user
  const createdUser = await User.create({
    fullName,
    username,
    profilePhoto: uploadedProfilePhoto,
    email,
    password,
  });
  //check if user is created successfully or throw error
  if (!createdUser) {
    throw (404, "Error creating profile");
  }

  // return success response
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

// login user
const loginUser = asyncHandler(async(req,res) =>{
  // take login credentials
    const {username,email,password} = req.body

  // validate password or throw invalid error
    if(!(username || email)){
         throw new ApiError(400, "username or email is required")
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Password")
    }
    
    // find user
    const user = await User.findOne({
        $or:[{username},{email}]
    })
  
  // generate access and refresh token
   const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

   // match them
   // create
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:false
    }
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})


const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly:true,
        secure:false
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )
})

const updateProfile = asyncHandler(async(req, res) =>{

  // get details
    const {fullName,email} = req.body

  // check if invalid 
    if(!(fullName|| email)){
        throw new ApiError(400, "Atleast one fields are required")
    }

  // find if a user exists with same email
    if(email){    
        const existingUser = await User.findOne(
        {
            email
        }
    )
        if(existingUser){
        throw new ApiError(400,"Email already exists")
    }
}

// find the user and update 
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                ...(fullName && { fullName }),
                ...(email && { email })
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})

const updatePassword = asyncHandler(async(req,res) =>{

  // get passwords
    const {oldPassword,newPassword} = req.body
  
    // find users
    const user = await User.findById(req.user?._id)
  

  // check password validity
    if (!user.password) {
        throw new ApiError(400, "Password not set for this user");
    }
    const isCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isCorrect){
        throw new ApiError(400, "Wrong Password")
    }
   
    // update password and save
    user.password = newPassword
    await user.save()

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))

})

const updateProfilePhoto = asyncHandler(async(req,res) =>{

     // get the new profile photo
     const profilePhotoPath =req.file?.path;
     

     // find the user
     const user = await User.findById(req.user?._id)
     
    // throw error if no user exists
     if(!user){
        throw new ApiError(404, "User not found")
     }
    

     // delete old photo
     if(user.profilePhoto?.public_id){
        try {
           await cloudinary.uploader.destroy(user.profilePhoto.public_id) 
        } catch (error) {
        console.log( error.message);
           throw new ApiError(400, "Error deleting old image") 
        }
     }
     
     // new photo upload check
     if(!profilePhotoPath){
        throw new ApiError(400, "Upload the new Profile photo")
     }

     // update profile photo and save
     const updatedProfilePhoto = await uploadOnCloudinary(profilePhotoPath)

     const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
         
         $set:{
            profilePhoto: {
                url:updatedProfilePhoto.secure_url,
                public_id: updatedProfilePhoto.public_id

            }
        }
         
        },
        {
            new: true
        }
     ).select("-password")


     return res
     .status(200)
     .json(
        new ApiResponse(200, updatedUser, "Profile Photo updated successfully")
     )
})


 const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id; 

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
      .status(404)
      .json(new ApiResponse(404, "Error deleting profile"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully"));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new ApiResponse(500,"Error deleting profile"));
  }
};












