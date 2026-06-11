const Cart = require("../models/Cart");
const Product = require("../models/Product");

const calcTotals = (items) => {
  let subtotal = 0, gstAmount = 0;
  items.forEach(({ product, quantity }) => {
    const price = product.distributorPrice * quantity;
    const gst = (price * (product.gstPercentage || 12)) / 100;
    subtotal += price;
    gstAmount += gst;
  });
  return { subtotal, gstAmount, total: subtotal + gstAmount };
};

// @GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) return res.json({ success: true, cart: { items: [], subtotal: 0, gstAmount: 0, total: 0 } });
    const { subtotal, gstAmount, total } = calcTotals(cart.items);
    res.json({ success: true, cart: { ...cart.toObject(), subtotal, gstAmount, total } });
  } catch (err) { next(err); }
};

// @POST /api/cart/add
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ success: false, message: "Insufficient stock" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const idx = cart.items.findIndex((i) => i.product.toString() === productId);
    if (idx > -1) {
      const newQty = cart.items[idx].quantity + quantity;
      if (newQty > product.stock) return res.status(400).json({ success: false, message: "Insufficient stock" });
      cart.items[idx].quantity = newQty;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");
    const { subtotal, gstAmount, total } = calcTotals(cart.items);
    res.json({ success: true, message: "Added to cart", cart: { ...cart.toObject(), subtotal, gstAmount, total } });
  } catch (err) { next(err); }
};

// @PUT /api/cart/update
exports.updateCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (product.stock < quantity) return res.status(400).json({ success: false, message: "Insufficient stock" });

    const cart = await Cart.findOne({ user: req.user._id });
    const item = cart.items.find((i) => i.product.toString() === productId);
    if (item) item.quantity = quantity;
    await cart.save();
    await cart.populate("items.product");
    const { subtotal, gstAmount, total } = calcTotals(cart.items);
    res.json({ success: true, cart: { ...cart.toObject(), subtotal, gstAmount, total } });
  } catch (err) { next(err); }
};

// @DELETE /api/cart/remove/:productId
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate("items.product");
    const { subtotal, gstAmount, total } = calcTotals(cart.items);
    res.json({ success: true, cart: { ...cart.toObject(), subtotal, gstAmount, total } });
  } catch (err) { next(err); }
};

// @DELETE /api/cart/clear
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) { next(err); }
};
