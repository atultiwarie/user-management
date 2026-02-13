const express = require('express');
const router = express.Router();
const {
  createUser,
  changeStatus,
  getDistance,
  userListing
} = require("../controller/userController");
const authMiddleware = require("../middleware/authUser")

// Create a new user
router.post("/register",createUser)

// Change status of all users
router.put("/change-status",authMiddleware,changeStatus)

// Calculate distance
router.get("/distance",authMiddleware,getDistance)

// User listing
router.get("/listing",authMiddleware,userListing)

module.exports = router;