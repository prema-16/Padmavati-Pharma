const Product = require("../models/Product");
const Category = require("../models/Category");

// @GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { search, category, sort = "-createdAt", page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      products,
    });
  } catch (err) { next(err); }
};

// @GET /api/products/featured
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .sort("-createdAt")
      .limit(8);
    res.json({ success: true, products });
  } catch (err) { next(err); }
};

// @GET /api/products/:id
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

// @POST /api/products  [owner/staff]
exports.createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;
    const product = await Product.create(data);
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });
    res.status(201).json({ success: true, product });
  } catch (err) { next(err); }
};

// @PUT /api/products/:id  [owner/staff]
exports.updateProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = req.file.filename;
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) { next(err); }
};

// @DELETE /api/products/:id  [owner only]
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
    res.json({ success: true, message: "Product deleted" });
  } catch (err) { next(err); }
};
