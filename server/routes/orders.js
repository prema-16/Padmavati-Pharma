const router = require("express").Router();
const ctrl = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);
router.post("/", ctrl.placeOrder);
router.get("/", ctrl.getMyOrders);
router.get("/:id", ctrl.getOrder);
router.put("/:id/cancel", ctrl.cancelOrder);

// Admin
router.get("/admin/all", authorize("owner", "staff"), ctrl.getAllOrders);
router.put("/admin/:id/status", authorize("owner", "staff"), ctrl.updateOrderStatus);

module.exports = router;
