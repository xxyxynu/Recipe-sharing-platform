const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true // 自动生成 createdAt 和 updatedAt
});

reviewSchema.index({ recipe: 1, user: 1 }, { unique: true });
reviewSchema.index({ recipe: 1 });
reviewSchema.index({ user: 1 });


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
