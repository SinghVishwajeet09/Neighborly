const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { rateUser } = require("../controllers/ratingController");

router.post("/rate", authMiddleware, rateUser);

module.exports = router;
