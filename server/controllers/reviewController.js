const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const numReviews = reviews.length;
  const averageRating = numReviews > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / numReviews : 0;
  await Product.findByIdAndUpdate(productId, { averageRating: parseFloat(averageRating.toFixed(1)), numReviews });
};

// @POST /api/reviews
exports.addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;
    const order = await Order.findOne({ user: req.user._id, "items.product": productId, status: "Delivered" });
    if (!order) return res.status(400).json({ success: false, message: "You can only review products you have purchased and received" });

    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) return res.status(400).json({ success: false, message: "You have already reviewed this product" });

    const review = await Review.create({ user: req.user._id, product: productId, rating, comment });
    res.status(201).json({ success: true, review, message: "Review submitted. It will be visible after approval." });
  } catch (err) { next(err); }
};

// @GET /api/reviews/:productId
exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate("user", "name").sort("-createdAt");
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};

// @DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    await updateProductRating(review.product);
    res.json({ success: true, message: "Review deleted" });
  } catch (err) { next(err); }
};

// @GET /api/admin/reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const { status = "pending" } = req.query;
    const query = status === "pending" ? { isApproved: false } : status === "approved" ? { isApproved: true } : {};
    const reviews = await Review.find(query).populate("user", "name email").populate("product", "name image").sort("-createdAt");
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};

// @PUT /api/admin/reviews/:id/approve
exports.approveReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    await updateProductRating(review.product);
    res.json({ success: true, review });
  } catch (err) { next(err); }
};

// @DELETE /api/admin/reviews/:id
exports.adminDeleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    await updateProductRating(review.product);
    res.json({ success: true, message: "Review deleted" });
  } catch (err) { next(err); }
};
