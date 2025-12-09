const { text } = require('express');
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    nutrition: {
        type: [String],
        default: []
    },
    image: {
        type: String
    },
    tags: [{
        type: String
    }],
    category: {
        type: String
    },
    prepTime: {
        type: Number,
        default: 0
    },
    cookTime: {
        type: Number,
        default: 0
    },
    servings: {
        type: Number,
        default: 1
    },
    calories: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    instructions: {
        type: [String],
        required: true
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true
});

recipeSchema.index({ author: 1 });
recipeSchema.index({ category: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ title: 'text', description: 'text', ingredients: 'text' });
recipeSchema.index({ views: -1 });
recipeSchema.index({ favorites: -1 });
recipeSchema.index({ createdAt: -1 });


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
