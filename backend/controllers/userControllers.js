const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/recipeModel');

// 生成 access token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30m',
    });
};

// 生成 refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });
};

// 注册
const register = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: 'All fields required' });
        return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: 'Email already exists' });
        return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    });

    res.status(201).json({
        token: accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar
        }
    });
});

// 登录
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        token: accessToken,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            //favoriteRecipes: user.favoriteRecipes
        }
    });
});

// 获取当前用户
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json({ user: req.user });
});

// 刷新 Access Token
const refreshToken = asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        res.status(401).json({ message: 'No refresh token provided' });
        return;
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Invalid refresh token' });
        } else {
            const user = await User.findById(decoded.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const newAccessToken = generateAccessToken(user);
            res.status(200).json({ token: newAccessToken });
        }
    });
});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

const updateName = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username },
        { new: true }
    ).select('-password');


    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
        message: 'Username updated',
        user: updatedUser
    });
});

// Add Favorite
const addFavorite = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const recipeId = req.params.recipeId;

    if (!user.favoriteRecipes.includes(recipeId)) {
        user.favoriteRecipes.push(recipeId);
        await user.save();
    }

    res.json({ message: "Added to favorites" });
});

// Remove Favorite
const removeFavorite = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const recipeId = req.params.recipeId;

    user.favoriteRecipes = user.favoriteRecipes.filter(id => id.toString() !== recipeId);
    await user.save();

    res.json({ message: "Removed from favorites" });
});

// Get Favorites List
const getFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('favoriteRecipes');
    res.json(user.favoriteRecipes);
});

const getMyRecipes = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const recipes = await Recipe.find({ author: userId }).sort({ createdAt: -1 });
    // 如果你想返回选定字段，可以用 .select('title description image tags ...')

    res.status(200).json(recipes);
});

module.exports = {
    register,
    login,
    currentUser,
    refreshToken,
    logout,
    updateName,
    addFavorite,
    removeFavorite,
    getFavorites,
    getMyRecipes
};
