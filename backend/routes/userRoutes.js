const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);
router.delete("/profile", auth, userController.deleteProfile);

module.exports = router;
