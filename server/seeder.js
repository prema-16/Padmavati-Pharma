const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

const User = require("./models/User");
const Category = require("./models/Category");
const Product = require("./models/Product");

connectDB();

const seed = async () => {
  try {
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Users
    const users = await User.insertMany([
      { name: "Admin Owner", email: "premanandlondhe16@gmail.com", password: await bcrypt.hash("Prema@16", 12), role: "owner", companyName: "Padmavati Pharma HQ", licenseNumber: "LIC-OWNER-001", phone: "9876543210", isEmailVerified: true, isActive: true },
      { name: "Staff Member", email: "staff@padmavatipharma.com", password: await bcrypt.hash("staff123", 12), role: "staff", companyName: "Padmavati Pharma HQ", licenseNumber: "LIC-STAFF-001", phone: "9876543211", isEmailVerified: true, isActive: true },
      { name: "John Pharmacy", email: "john@pharmacy.com", password: await bcrypt.hash("john123", 12), role: "customer", companyName: "John Medical Store", licenseNumber: "LIC-CUST-001", phone: "9876543212", isEmailVerified: true, isActive: true },
    ]);
    console.log("✅ Users seeded");

    // Categories
    const categories = await Category.insertMany([
      { name: "Tablets", description: "Pharmaceutical tablets", isActive: true },
      { name: "Capsules", description: "Capsule medications", isActive: true },
      { name: "Syrups", description: "Liquid medications", isActive: true },
      { name: "Injections", description: "Injectable medications", isActive: true },
      { name: "Surgical Products", description: "Surgical supplies", isActive: true },
      { name: "Medical Equipment", description: "Medical devices", isActive: true },
      { name: "Personal Care", description: "Personal healthcare", isActive: true },
    ]);
    console.log("✅ Categories seeded");

    const c = (name) => categories.find((x) => x.name === name)._id;

    // Products
    await Product.insertMany([
      { name: "Paracetamol 500mg", description: "Pain reliever and fever reducer. Effective for headaches, muscle aches, and fever.", manufacturer: "PharmaCorp Ltd", batchNumber: "BATCH-001", expiryDate: new Date("2026-12-31"), mrp: 50, distributorPrice: 35, stock: 500, prescriptionRequired: false, gstPercentage: 12, category: c("Tablets"), medicalUsage: "Fever and pain", dosage: "1-2 tabs every 6 hrs", isActive: true },
      { name: "Amoxicillin 500mg", description: "Antibiotic for bacterial infections.", manufacturer: "MediLife Pharma", batchNumber: "BATCH-002", expiryDate: new Date("2026-10-31"), mrp: 120, distributorPrice: 85, stock: 300, prescriptionRequired: true, gstPercentage: 12, category: c("Capsules"), medicalUsage: "Bacterial infections", dosage: "1 cap 3x daily", isActive: true },
      { name: "Cough Syrup 100ml", description: "Relieves cough and throat irritation.", manufacturer: "HealthCare Pharma", batchNumber: "BATCH-003", expiryDate: new Date("2026-06-30"), mrp: 80, distributorPrice: 55, stock: 200, prescriptionRequired: false, gstPercentage: 12, category: c("Syrups"), medicalUsage: "Cough & cold", dosage: "10ml 3x daily", isActive: true },
      { name: "Insulin Injection 100IU", description: "Insulin for diabetes management.", manufacturer: "DiabetCare Inc", batchNumber: "BATCH-004", expiryDate: new Date("2026-08-31"), mrp: 450, distributorPrice: 380, stock: 150, prescriptionRequired: true, gstPercentage: 12, category: c("Injections"), medicalUsage: "Diabetes", dosage: "As prescribed", isActive: true },
      { name: "Surgical Gloves 100 pairs", description: "Sterile latex surgical gloves, medium.", manufacturer: "SurgiTech Ltd", batchNumber: "BATCH-005", expiryDate: new Date("2027-12-31"), mrp: 800, distributorPrice: 650, stock: 100, prescriptionRequired: false, gstPercentage: 18, category: c("Surgical Products"), medicalUsage: "Surgical use", dosage: "Single use", isActive: true },
      { name: "Digital Thermometer", description: "Fast accurate LCD digital thermometer.", manufacturer: "MediTech Devices", batchNumber: "BATCH-006", expiryDate: new Date("2030-12-31"), mrp: 250, distributorPrice: 180, stock: 250, prescriptionRequired: false, gstPercentage: 18, category: c("Medical Equipment"), medicalUsage: "Temperature", dosage: "As needed", isActive: true },
      { name: "Hand Sanitizer 500ml", description: "70% alcohol-based sanitizer. Kills 99.9% germs.", manufacturer: "HygienePlus", batchNumber: "BATCH-007", expiryDate: new Date("2026-12-31"), mrp: 150, distributorPrice: 100, stock: 400, prescriptionRequired: false, gstPercentage: 18, category: c("Personal Care"), medicalUsage: "Hand hygiene", dosage: "Apply as needed", isActive: true },
      { name: "Vitamin C 500mg", description: "Immune system support antioxidant supplement.", manufacturer: "NutriHealth", batchNumber: "BATCH-008", expiryDate: new Date("2027-06-30"), mrp: 200, distributorPrice: 140, stock: 350, prescriptionRequired: false, gstPercentage: 12, category: c("Tablets"), medicalUsage: "Vitamin C supplement", dosage: "1 tab daily", isActive: true },
    ]);
    console.log("✅ Products seeded");

    console.log("\n🎉 Database seeded!\n");
    console.log("Owner   : premanandlondhe16@gmail.com / Prema@16");
    console.log("Staff   : staff@padmavatipharma.com / staff123");
    console.log("Customer: john@pharmacy.com / john123\n");
    process.exit(0);
  } catch (err) {
    console.error("❌", err);
    process.exit(1);
  }
};

seed();
