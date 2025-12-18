import { computed } from 'vue';

export function useDateFormatter() {

    // 1. 标准格式化: "December 18, 2025"
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        // 简单的错误检查
        if (isNaN(date.getTime())) return '';

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // 2. 相对时间: "2 days ago", "Just now"
    const timeAgo = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + (interval === 1 ? " year ago" : " years ago");

        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + (interval === 1 ? " month ago" : " months ago");

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + (interval === 1 ? " day ago" : " days ago");

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + (interval === 1 ? " hour ago" : " hours ago");

        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + (interval === 1 ? " minute ago" : " minutes ago");

        return "Just now";
    };

    return {
        formatDate,
        timeAgo
    };
}