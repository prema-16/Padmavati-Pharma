const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

// @GET /api/admin/dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const [totalProducts, totalUsers, totalOrders, pendingOrders] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
    ]);

    const orders = await Order.find({}, "totalPrice");
    const revenue = orders.reduce((a, o) => a + (o.totalPrice || 0), 0);

    const recentOrders = await Order.find()
      .populate("user", "name email companyName")
      .sort("-createdAt").limit(8);

    const lowStock = await Product.find({ stock: { $lt: 10 }, isActive: true })
      .select("name stock").limit(10);

    const expiringProducts = await Product.find({
      expiryDate: { $gte: new Date(), $lte: new Date(Date.now() + 30 * 86400000) },
      isActive: true,
    }).select("name expiryDate").sort("expiryDate").limit(10);

    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } } },
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product", totalQuantity: { $sum: "$items.quantity" }, totalRevenue: { $sum: "$items.total" } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { "product.name": 1, "product.image": 1, totalQuantity: 1, totalRevenue: 1 } },
    ]);

    res.json({
      success: true,
      stats: { totalProducts, totalUsers, totalOrders, pendingOrders, revenue },
      recentOrders,
      lowStock,
      expiringProducts,
      monthlySales,
      topProducts,
    });
  } catch (err) { next(err); }
};

// @GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).select("-password").sort("-createdAt").skip(skip).limit(parseInt(limit));
    res.json({ success: true, users, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { next(err); }
};

// @PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// @PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// @GET /api/admin/reports/sales
exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    const orders = await Order.find(query).populate("user", "name companyName").sort("-createdAt");
    const totalRevenue = orders.reduce((a, o) => a + o.totalPrice, 0);
    res.json({ success: true, orders, totalRevenue, totalOrders: orders.length });
  } catch (err) { next(err); }
};
