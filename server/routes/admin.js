const router = require("express").Router();
const ctrl = require("../controllers/adminController");
const orderCtrl = require("../controllers/orderController");
const reviewCtrl = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("owner", "staff"));

router.get("/dashboard", ctrl.getDashboard);
router.get("/users", ctrl.getUsers);
router.put("/users/:id/role", authorize("owner"), ctrl.updateUserRole);
router.put("/users/:id/toggle", authorize("owner"), ctrl.toggleUserStatus);
router.get("/orders", orderCtrl.getAllOrders);
router.put("/orders/:id/status", orderCtrl.updateOrderStatus);
router.get("/reviews", reviewCtrl.getAllReviews);
router.put("/reviews/:id/approve", reviewCtrl.approveReview);
router.delete("/reviews/:id", reviewCtrl.adminDeleteReview);
router.get("/reports/sales", ctrl.getSalesReport);

module.exports = router;
