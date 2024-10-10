import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { username }]
})

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  } 

//   const avatar = await uploadOnCloudinary(avatarLocalPath)
//   let coverImage = ""

//   if (coverImageLocalPath) {
//      coverImage = await uploadOnCloudinary(coverImageLocalPath)
//   }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar uploaded successfully", avatar);
    
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("coverImage uploaded successfully", coverImage);
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new ApiError(500, "Something went wrong while uploading coverImage");
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage ? coverImage.url : "",
      username: username.toLowerCase(),
      email,
      password
    })
  
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )
  
    if(!createdUser) {
      throw new ApiError(500, "Something went wrong while creating user")
    }
  
    return res
    .status(201)
    .json( new ApiResponse(201, "User Created Successfully", createdUser));
  } catch (error) {
    console.log("Error creating user", error);
    if (avatar) {
        await deleteFromCloudinary(avatar.public_id)
    }

    if (coverImage) {
        await deleteFromCloudinary(coverImage.public_id)
    }

    throw new ApiError(500, "Something went wrong while creating user and images were deleted from cloudinary");
    
  }
  
});



export { registerUser };
