const router = require("express").Router();
const ctrl = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", ctrl.getProducts);
router.get("/featured", ctrl.getFeaturedProducts);
router.get("/:id", ctrl.getProduct);
router.post("/", protect, authorize("owner", "staff"), upload.single("image"), ctrl.createProduct);
router.put("/:id", protect, authorize("owner", "staff"), upload.single("image"), ctrl.updateProduct);
router.delete("/:id", protect, authorize("owner"), ctrl.deleteProduct);

module.exports = router;
