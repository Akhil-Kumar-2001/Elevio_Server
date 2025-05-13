"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        message: "Category name is required",
    },
    status: {
        type: Number,
        enum: [1, -1],
        default: 1,
    },
}, { timestamps: true });
const Category = (0, mongoose_1.model)("Category", categorySchema);
exports.Category = Category;
