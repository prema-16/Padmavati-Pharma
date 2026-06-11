const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    manufacturer: { type: String, required: true },
    batchNumber: String,
    expiryDate: { type: Date, required: true },
    mrp: { type: Number, required: true, min: 0 },
    distributorPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    image: String,
    prescriptionRequired: { type: Boolean, default: false },
    gstPercentage: { type: Number, default: 12 },
    medicalUsage: String,
    dosage: String,
    productType: String,
    minOrderQuantity: { type: Number, default: 1 },
    discount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", manufacturer: "text" });

module.exports = mongoose.model("Product", productSchema);
