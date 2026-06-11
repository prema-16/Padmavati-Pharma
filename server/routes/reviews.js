const router = require("express").Router();
const ctrl = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

router.get("/:productId", ctrl.getProductReviews);
router.post("/", protect, ctrl.addReview);
router.delete("/:id", protect, ctrl.deleteReview);

// Admin
router.get("/admin/all", protect, authorize("owner", "staff"), ctrl.getAllReviews);
router.put("/admin/:id/approve", protect, authorize("owner", "staff"), ctrl.approveReview);
router.delete("/admin/:id", protect, authorize("owner", "staff"), ctrl.adminDeleteReview);

module.exports = router;
