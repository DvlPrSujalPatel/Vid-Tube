import { Router } from "express";

import {
  registerUser,
  logoutUser,
  loginUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verfyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// unsecured routes

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),

  registerUser
);

router.route("login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// secured routes

router.route("/logout").post(verfyJWT, logoutUser);
router.route("change-password").post(verfyJWT, changeCurrentPassword)
router.route("current-user").get(verfyJWT, getCurrentUser)
router.route("c/:username").get(verfyJWT, getUserChannelProfile)
router.route("/update-account").patch(verfyJWT, updateAccountDetails)
router.route("/avatar").patch(verfyJWT, upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verfyJWT, upload.single("coverImage"),updateUserCoverImage)
router.route("history").get(verfyJWT, getWatchHistory)



export default router;
