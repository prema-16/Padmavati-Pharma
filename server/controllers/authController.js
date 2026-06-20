const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

// Helper: send token response
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      phone: user.phone,
      address: user.address,
      isEmailVerified: user.isEmailVerified,
    },
  });
};

// @POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, companyName, licenseNumber, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password, companyName, licenseNumber, phone });
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Please provide email and password" });

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    if (!user.isActive)
      return res.status(401).json({ success: false, message: "Account deactivated. Contact admin." });

    // update last login without triggering pre-save hook
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
};

// @PUT /api/auth/updateprofile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, companyName, phone, licenseNumber, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, companyName, phone, licenseNumber, address },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// @PUT /api/auth/changepassword
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(currentPassword)))
      return res.status(400).json({ success: false, message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @POST /api/auth/forgotpassword
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: "No account with that email" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1d4ed8; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">💊 Padmavati Pharma</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; margin-top: 0;">Reset Your Password</h2>
          <p style="color: #6b7280;">Hi ${user.name},</p>
          <p style="color: #6b7280;">We received a request to reset your password. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #1d4ed8; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 13px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #6b7280; font-size: 13px; word-break: break-all;">${resetUrl}</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Link — Padmavati Pharma",
        html,
      });
      res.json({ success: true, message: "Password reset link has been sent to your email." });
    } catch (emailErr) {
      // Roll back token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: "Email could not be sent. Error: " + emailErr.message });
    }
  } catch (err) {
    next(err);
  }
};

// @PUT /api/auth/resetpassword/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
