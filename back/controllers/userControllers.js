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

const register = asyncHandler(async (req, res) => {
    let { username, email, password } = req.body;

    // 1. 基础字段校验
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields (username, email, password)');
    }

    // 2. 格式化数据 (转小写，去空格)
    email = email.toLowerCase().trim();
    username = username.trim();

    // 3. 检查用户是否已存在
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // 4. 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. 创建用户 (关键步骤)
    try {
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });


        // 6. 如果创建成功，生成 Token 并返回
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // 设置 Cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // 本地开发设为 false
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
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

    } catch (error) {
        // 捕获 Mongoose 校验错误 (例如密码太短、邮箱格式不对)
        res.status(400);
        throw new Error(error.message); // 把具体的数据库错误抛给前端
    }
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

const currentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio,
            followers: user.followers, // 返回 ID 数组
            following: user.following  // 返回 ID 数组          
        }
    });
});

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

const getFavorites = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate({
        path: 'favoriteRecipes',
        populate: {
            path: 'author',
            select: 'username avatar' // 只取需要的字段
        }
    });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(user.favoriteRecipes);
});

const getMyRecipes = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const recipes = await Recipe.find({ author: userId })
        .sort({ createdAt: -1 })
        .populate('author', 'username avatar'); // ✅ 添加这一行

    res.status(200).json(recipes);
});

const getAllChefs = asyncHandler(async (req, res) => {
    const search = req.query.search || ''; // 获取 search 参数

    let query = {};

    // 如果有搜索词，使用正则模糊查询 (不区分大小写)
    if (search) {
        query.username = { $regex: search, $options: 'i' };
    }

    // 查询用户，排除敏感信息
    const chefs = await User.find(query)
        .select('-password -email -favoriteRecipes')
        .sort({ followers: -1 }); // 默认按粉丝数排序

    res.json(chefs);
});

// 2. 获取特定厨师的公开主页信息
const getChefProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password -favoriteRecipes') // 不返回隐私信息
        .populate('followers', 'username avatar') // 可选：显示粉丝头像
        .populate('following', 'username avatar');

    if (!user) {
        res.status(404);
        throw new Error('Chef not found');
    }

    res.json(user);
});

// 3. 关注/取消关注 (双向更新)
const toggleFollow = asyncHandler(async (req, res) => {
    const targetUserId = req.params.id; // 我想关注的人
    const currentUserId = req.user.id;  // 我自己

    if (targetUserId === currentUserId) {
        res.status(400);
        throw new Error('You cannot follow yourself');
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
        res.status(404);
        throw new Error('User not found');
    }

    // 检查是否已关注
    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
        // --- 取消关注 ---
        currentUser.following.pull(targetUserId);
        targetUser.followers.pull(currentUserId);
        await currentUser.save();
        await targetUser.save();
        res.json({ message: 'Unfollowed', isFollowing: false });
    } else {
        // --- 关注 ---
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
        await currentUser.save();
        await targetUser.save();
        res.json({ message: 'Followed', isFollowing: true });
    }
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
    getMyRecipes,
    getAllChefs,
    getChefProfile,
    toggleFollow
};
