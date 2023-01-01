const express = require("express");
const auth = require("../middleware/auth"); // auth.js is also exported directly
const isAdmin = require("../middleware/isAdmin");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/users", auth, isAdmin, adminController.getAllUsers);
router.put("/users/:id", auth, isAdmin, adminController.updateUser);
router.delete("/users/:id", auth, isAdmin, adminController.deleteUser);

module.exports = router;
