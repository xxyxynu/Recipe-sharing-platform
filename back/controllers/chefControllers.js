const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Recipe = require('../models/recipeModel');

// Get all chefs (users) with aggregated stats
const getAllChefs = asyncHandler(async (req, res) => {
    const { search } = req.query;
    
    // Build search query
    let query = {};
    if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query = {
            $or: [
                { username: searchRegex },
                { email: searchRegex }
            ]
        };
    }

    // Get all users
    const users = await User.find(query)
        .select('-password -email')
        .populate('followers', '_id username')
        .lean();

    // Aggregate stats for each user
    const chefsWithStats = await Promise.all(
        users.map(async (user) => {
            // Get user's recipes
            const recipes = await Recipe.find({ author: user._id }).lean();
            
            // Calculate stats
            const recipeCount = recipes.length;
            const totalViews = recipes.reduce((sum, recipe) => sum + (recipe.views || 0), 0);
            const followersCount = Array.isArray(user.followers) ? user.followers.length : 0;
            const latestRecipe = recipes.length > 0 
                ? recipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                : null;

            return {
                _id: user._id,
                username: user.username,
                avatar: user.avatar,
                recipeCount,
                totalViews,
                followers: followersCount,
                latestRecipe: latestRecipe ? {
                    _id: latestRecipe._id,
                    title: latestRecipe.title,
                    image: latestRecipe.image,
                    createdAt: latestRecipe.createdAt
                } : null,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
        })
    );

    // Sort by recipe count (descending), then by total views
    chefsWithStats.sort((a, b) => {
        if (b.recipeCount !== a.recipeCount) {
            return b.recipeCount - a.recipeCount;
        }
        return b.totalViews - a.totalViews;
    });

    res.status(200).json(chefsWithStats);
});

// Get chef profile by ID
const getChefProfile = asyncHandler(async (req, res) => {
    const { chefId } = req.params;

    const user = await User.findById(chefId).select('-password').lean();
    if (!user) {
        res.status(404).json({ message: 'Chef not found' });
        return;
    }

    // Get user's recipes
    const recipes = await Recipe.find({ author: chefId })
        .sort({ createdAt: -1 })
        .lean();

    // Calculate stats
    const recipeCount = recipes.length;
    const totalViews = recipes.reduce((sum, recipe) => sum + (recipe.views || 0), 0);
    const followersCount = Array.isArray(user.followers) ? user.followers.length : 0;
    const followingCount = Array.isArray(user.following) ? user.following.length : 0;

    res.status(200).json({
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        recipeCount,
        totalViews,
        followers: followersCount,
        following: followingCount,
        recipes: recipes.map(recipe => ({
            _id: recipe._id,
            title: recipe.title,
            description: recipe.description,
            image: recipe.image,
            views: recipe.views || 0,
            favorites: recipe.favorites ? recipe.favorites.length : 0,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt
        })),
        createdAt: user.createdAt
    });
});

// Follow a chef
const followChef = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;
    const { chefId } = req.params;

    if (currentUserId === chefId) {
        res.status(400).json({ message: 'Cannot follow yourself' });
        return;
    }

    const chef = await User.findById(chefId);
    if (!chef) {
        res.status(404).json({ message: 'Chef not found' });
        return;
    }

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    // Convert to ObjectId for comparison
    const currentUserIdObj = new mongoose.Types.ObjectId(currentUserId);
    const chefIdObj = new mongoose.Types.ObjectId(chefId);

    // Check if already following (compare as strings)
    const isAlreadyFollowing = chef.followers && chef.followers.some(
        followerId => followerId.toString() === currentUserId.toString()
    );
    
    if (isAlreadyFollowing) {
        res.status(400).json({ message: 'Already following this chef' });
        return;
    }

    // Add to chef's followers
    if (!chef.followers) {
        chef.followers = [];
    }
    chef.followers.push(currentUserIdObj);
    await chef.save();

    // Add to current user's following
    if (!currentUser.following) {
        currentUser.following = [];
    }
    // Check if not already in following list
    const isAlreadyInFollowing = currentUser.following.some(
        followingId => followingId.toString() === chefId.toString()
    );
    if (!isAlreadyInFollowing) {
        currentUser.following.push(chefIdObj);
        await currentUser.save();
    }

    res.status(200).json({ 
        message: 'Successfully followed chef',
        followersCount: chef.followers.length
    });
});

// Unfollow a chef
const unfollowChef = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;
    const { chefId } = req.params;

    const chef = await User.findById(chefId);
    if (!chef) {
        res.status(404).json({ message: 'Chef not found' });
        return;
    }

    const currentUser = await User.findById(currentUserId);

    // Remove from chef's followers
    if (chef.followers) {
        chef.followers = chef.followers.filter(
            id => id.toString() !== currentUserId.toString()
        );
        await chef.save();
    }

    // Remove from current user's following
    if (currentUser.following) {
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== chefId.toString()
        );
        await currentUser.save();
    }

    res.status(200).json({ 
        message: 'Successfully unfollowed chef',
        followersCount: chef.followers ? chef.followers.length : 0
    });
});

// Get following list
const getFollowing = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;

    const user = await User.findById(currentUserId)
        .populate('following', 'username avatar')
        .lean();

    if (!user || !user.following) {
        res.status(200).json([]);
        return;
    }

    // Get stats for each followed chef
    const followingWithStats = await Promise.all(
        user.following.map(async (chef) => {
            const recipes = await Recipe.find({ author: chef._id }).lean();
            const recipeCount = recipes.length;
            const totalViews = recipes.reduce((sum, recipe) => sum + (recipe.views || 0), 0);
            const followersCount = Array.isArray(chef.followers) ? chef.followers.length : 0;

            return {
                _id: chef._id,
                username: chef.username,
                avatar: chef.avatar,
                recipeCount,
                totalViews,
                followers: followersCount,
                latestRecipe: recipes.length > 0 
                    ? recipes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                    : null
            };
        })
    );

    res.status(200).json(followingWithStats);
});

// Check if following a chef
const isFollowing = asyncHandler(async (req, res) => {
    const currentUserId = req.user.id;
    const { chefId } = req.params;

    const user = await User.findById(currentUserId);
    const isFollowingChef = user.following && user.following.includes(chefId);

    res.status(200).json({ isFollowing: !!isFollowingChef });
});

// Get chefs by recipe (find users who created similar recipes)
const getChefsByRecipe = asyncHandler(async (req, res) => {
    const { recipeId } = req.params;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        res.status(404).json({ message: 'Recipe not found' });
        return;
    }

    // Find recipes with similar tags or category
    const similarRecipes = await Recipe.find({
        $or: [
            { tags: { $in: recipe.tags || [] } },
            { category: recipe.category }
        ],
        _id: { $ne: recipeId }
    }).distinct('author');

    // Get unique chefs
    const chefIds = [...new Set(similarRecipes.map(id => id.toString()))];
    
    if (chefIds.length === 0) {
        res.status(200).json([]);
        return;
    }

    const chefs = await User.find({ _id: { $in: chefIds } })
        .select('-password')
        .lean();

    // Get stats for each chef
    const chefsWithStats = await Promise.all(
        chefs.map(async (chef) => {
            const recipes = await Recipe.find({ author: chef._id }).lean();
            const recipeCount = recipes.length;
            const totalViews = recipes.reduce((sum, recipe) => sum + (recipe.views || 0), 0);
            const followersCount = Array.isArray(chef.followers) ? chef.followers.length : 0;

            return {
                _id: chef._id,
                username: chef.username,
                avatar: chef.avatar,
                recipeCount,
                totalViews,
                followers: followersCount
            };
        })
    );

    res.status(200).json(chefsWithStats);
});

module.exports = {
    getAllChefs,
    getChefProfile,
    followChef,
    unfollowChef,
    getFollowing,
    isFollowing,
    getChefsByRecipe
};

