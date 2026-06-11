const router = require("express").Router();
const ctrl = require("../controllers/categoryController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", ctrl.getCategories);
router.get("/all", protect, authorize("owner", "staff"), ctrl.getAllCategories);
router.post("/", protect, authorize("owner", "staff"), ctrl.createCategory);
router.put("/:id", protect, authorize("owner", "staff"), ctrl.updateCategory);
router.delete("/:id", protect, authorize("owner"), ctrl.deleteCategory);

module.exports = router;
