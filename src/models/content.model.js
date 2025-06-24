import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ["article", "note", "resource"], default: "note" },
  summary: { type: String },
  keywords: [{ type: String }],
  tags: [{ type: String }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Content", contentSchema);