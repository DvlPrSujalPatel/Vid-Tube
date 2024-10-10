import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"


const registerUser = asyncHandler(async (req, res) => {
        const {fullName, email, username, password} = req.body

        if(
            [fullName, username, email, password].some((field) => field?.trim() === "")
        ){
            throw new ApiError(400, "All fields are required")
        }

        

});
    
    export { registerUser }