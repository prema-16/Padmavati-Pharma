const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @POST /api/orders
exports.placeOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    for (const item of cart.items) {
      if (item.product.stock < item.quantity)
        return res.status(400).json({ success: false, message: `Insufficient stock: ${item.product.name}` });
    }

    let subtotal = 0, gstAmount = 0;
    const orderItems = cart.items.map(({ product, quantity }) => {
      const price = product.distributorPrice;
      const gst = (price * quantity * (product.gstPercentage || 12)) / 100;
      const total = price * quantity + gst;
      subtotal += price * quantity;
      gstAmount += gst;
      return { product: product._id, quantity, price, gst, total };
    });

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || "COD",
      notes: req.body.notes,
      subtotal,
      gstAmount,
      shippingCost: 0,
      totalPrice: subtotal + gstAmount,
      statusHistory: [{ status: "Pending", updatedBy: req.user._id, notes: "Order placed" }],
    });

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }
    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
};

// @GET /api/orders  (my orders)
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments({ user: req.user._id });
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image")
      .sort("-createdAt").skip(skip).limit(parseInt(limit));
    res.json({ success: true, orders, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { next(err); }
};

// @GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email companyName")
      .populate("statusHistory.updatedBy", "name");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role === "customer")
      return res.status(403).json({ success: false, message: "Not authorized" });

    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// @PUT /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!["Pending", "Confirmed"].includes(order.status))
      return res.status(400).json({ success: false, message: "Cannot cancel at this stage" });

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    order.status = "Cancelled";
    order.cancelReason = req.body.reason || "Customer cancelled";
    order.statusHistory.push({ status: "Cancelled", updatedBy: req.user._id, notes: order.cancelReason });
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
};

// ── Admin ──────────────────────────────────────────────────────

// @GET /api/admin/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email companyName")
      .populate("items.product", "name")
      .sort("-createdAt").skip(skip).limit(parseInt(limit));
    res.json({ success: true, orders, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { next(err); }
};

// @PUT /api/admin/orders/:id
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === "Delivered") { order.deliveredAt = new Date(); order.paymentStatus = "Paid"; }
    order.statusHistory.push({ status, updatedBy: req.user._id, notes });
    await order.save();
    res.json({ success: true, order });
  } catch (err) { next(err); }
};
