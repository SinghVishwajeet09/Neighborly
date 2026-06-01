const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createRequest, getRequests, acceptRequest, completeRequest } = require("../controllers/requestController");

router.post("/create", authMiddleware, createRequest);
router.get("/all", authMiddleware, getRequests);
router.post("/accept", authMiddleware, acceptRequest);
router.post("/complete", authMiddleware, completeRequest);

module.exports = router;
