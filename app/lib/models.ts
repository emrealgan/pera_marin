import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true },
  },
  { collection: "admin" }
);

const admin = mongoose.models.admin || mongoose.model("admin", userSchema);

const dataSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { collection: "Product" }
);
const Product =
  mongoose.models.Product || mongoose.model("Product", dataSchema);

export { Product, admin };
