const router = require("express").Router();
const ctrl = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);
router.get("/me", protect, ctrl.getMe);
router.put("/updateprofile", protect, ctrl.updateProfile);
router.put("/changepassword", protect, ctrl.changePassword);
router.post("/forgotpassword", ctrl.forgotPassword);
router.put("/resetpassword/:token", ctrl.resetPassword);

module.exports = router;
