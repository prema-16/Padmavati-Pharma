const Wishlist = require("../models/Wishlist");

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({ path: "products", populate: { path: "category", select: "name" } });
    res.json({ success: true, products: wishlist ? wishlist.products : [] });
  } catch (err) { next(err); }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    if (wishlist.products.includes(productId))
      return res.status(400).json({ success: false, message: "Already in wishlist" });
    wishlist.products.push(productId);
    await wishlist.save();
    res.json({ success: true, message: "Added to wishlist" });
  } catch (err) { next(err); }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId);
      await wishlist.save();
    }
    res.json({ success: true, message: "Removed from wishlist" });
  } catch (err) { next(err); }
};
