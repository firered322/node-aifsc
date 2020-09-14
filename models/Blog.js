const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, // trim any whitespace
    },
    body: {
        type: String,
        required: true,
    },
    // linking it up to a User model
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Blog", BlogSchema);
