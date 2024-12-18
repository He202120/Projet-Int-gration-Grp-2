//? ===================================================== User Routes =====================================================

// ===================== Importing necessary modules/files =====================
import express from "express";

// Custom Authentication middleware from my npm package.
// Reference: https://www.npmjs.com/package/base-auth-handler
import { requireAuth, validateRequest } from "base-auth-handler";

import verifyAdmin from "../../middlewares/verifyAdminMiddleware.js";

// ===================== Configuring Express Router =====================
const router = express.Router();

import { getParkingsData } from "../../controllers/parkingController.js";

import {putSubscriptionData, getAllSubscription,deleteSubscription,update_Subscription} from "../../controllers/subscriptionController.js";

import {
  authAdmin,
  registerAdmin,
  logoutAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  updateUserData,
  blockUser,
  unBlockUser,
  deleteUserData,
  getAllUsersData,
  getAllReview,
  addParking,
  deleteParking,
  deleteAvisData,
  getUsersByParkingIdData,
} from "../../controllers/adminController.js";

// Data validation configuration
import {
  adminSignInDataValidation,
  adminSignUpDataValidation,
  adminUserBlockingDataValidation,
  adminUserUpdateDataValidation,
} from "./backendDataValidationConfig.js";

//? =============================== Routes ===============================

//* ==================== Authentication Routes ====================

router.post("/", adminSignUpDataValidation, validateRequest, registerAdmin);

router.post("/auth", adminSignInDataValidation, validateRequest, authAdmin);

router.post("/logout", logoutAdmin);

//* ==================== Admin Profile Routes ====================

router
  .route("/profile")
  .get(requireAuth, verifyAdmin, getAdminProfile)
  .put(requireAuth, verifyAdmin, updateAdminProfile);
// In the above line, the route is same, above line will use the specified controller according to the type of the request

//* ==================== User Management Routes ====================

router.post("/get-users", requireAuth, verifyAdmin, getAllUsers);

router.delete(
  "/delete-user",
  requireAuth,
  verifyAdmin,
  validateRequest,
  deleteUserData
);

router.patch(
  "/block-user",
  requireAuth,
  verifyAdmin,
  adminUserBlockingDataValidation,
  validateRequest,
  blockUser
);

router.patch(
  "/unblock-user",
  requireAuth,
  verifyAdmin,
  adminUserBlockingDataValidation,
  validateRequest,
  unBlockUser
);

router.put(
  "/update-user",
  requireAuth,
  verifyAdmin,
  adminUserUpdateDataValidation,
  validateRequest,
  updateUserData
);


router.post("/get-info-users", requireAuth, verifyAdmin, getAllUsersData);

router.post("/get-review", requireAuth, verifyAdmin, getAllReview);

router.post("/get-parkings", requireAuth, verifyAdmin, getParkingsData);

router.post("/put-sub", requireAuth, verifyAdmin, putSubscriptionData);

router.post("/get-all-sub", requireAuth, verifyAdmin, getAllSubscription);

router.delete("/delete-sub", requireAuth, verifyAdmin, deleteSubscription);

router.post("/update-sub", requireAuth, verifyAdmin, update_Subscription);

//* ===================== Parking Management Routes ==================

router.post("/add-parking", requireAuth, verifyAdmin, addParking);

router.delete(
  "/delete-parking",
  requireAuth,
  verifyAdmin,
  validateRequest,
  deleteParking
);
router.delete("/delete-avis", requireAuth, verifyAdmin, deleteAvisData);
router.post("/get-users-by-parking", requireAuth, verifyAdmin, getUsersByParkingIdData);
export default router;
