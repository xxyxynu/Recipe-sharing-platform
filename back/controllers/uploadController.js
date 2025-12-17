const multer = require('multer');
const User = require('../models/userModel');
const { avatarStorage } = require('../config/cloudinary'); // 引入配置

// 使用 Cloudinary storage
const upload = multer({ storage: avatarStorage });

const uploadAvatar = async (req, res) => {
    // 注意：使用 Cloudinary 后，req.file.path 就是图片的完整 http 网址
    if (!req.file || !req.file.path) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const userId = req.user.id;
        // 直接存入 Cloudinary 返回的完整 URL
        const imageUrl = req.file.path;

        const user = await User.findByIdAndUpdate(userId, { avatar: imageUrl }, { new: true });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Avatar uploaded',
            avatar: user.avatar,
            username: user.username,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

module.exports = {
    upload,
    uploadAvatar
};