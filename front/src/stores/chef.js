// src/stores/chef.js
import { defineStore } from 'pinia';
import api from '../utils/api';
import { useAuthStore } from './auth';

export const useChefStore = defineStore('chef', {
    state: () => ({
        chefs: [],
        currentChef: null, // 当前查看的厨师详情
        chefRecipes: [],   // 当前厨师的菜谱
        loading: false,
    }),

    actions: {
        // 获取所有厨师
        async fetchAllChefs() {
            this.loading = true;
            try {
                const res = await api.get('/users/chefs');
                this.chefs = res.data;
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        // 获取单个厨师详情（包含他的菜谱）
        async fetchChefDetail(id) {
            this.loading = true;
            this.currentChef = null;
            this.chefRecipes = [];
            try {
                // 1. 获取用户信息
                const profileRes = await api.get(`/users/chef/${id}`);
                this.currentChef = profileRes.data;

                // 2. 获取他的菜谱 (复用已有的 recipe 接口)
                const recipesRes = await api.get(`/recipes/all?author=${id}`);
                this.chefRecipes = recipesRes.data.recipes;
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        async toggleFollow(targetUserId) {
            const authStore = useAuthStore();
            if (!authStore.isAuthenticated) return false;

            try {
                const res = await api.post(`/users/follow/${targetUserId}`);
                const isFollowing = res.data.isFollowing;
                const myId = authStore.user.id || authStore.user._id;

                // 1. 更新厨师列表/详情页的 UI (之前的逻辑)
                const chefInList = this.chefs.find(c => c._id === targetUserId);
                if (chefInList) {
                    if (isFollowing) chefInList.followers.push(myId);
                    else chefInList.followers = chefInList.followers.filter(id => id !== myId);
                }
                if (this.currentChef && this.currentChef._id === targetUserId) {
                    if (isFollowing) this.currentChef.followers.push(myId);
                    else this.currentChef.followers = this.currentChef.followers.filter(id => id !== myId);
                }

                // 🔥🔥🔥 2. 新增：同步更新 AuthStore (我自己的数据) 🔥🔥🔥
                // 这样 Profile 页面的 "Following" 数量才会实时变化
                if (authStore.user) {
                    // 确保数组存在
                    if (!authStore.user.following) authStore.user.following = [];

                    if (isFollowing) {
                        // 关注了：把他的 ID 加到我的 following 列表
                        authStore.user.following.push(targetUserId);
                    } else {
                        // 取消关注：把他的 ID 从我的 following 列表移除
                        authStore.user.following = authStore.user.following.filter(id => id !== targetUserId);
                    }
                }

                return true;
            } catch (err) {
                console.error(err);
                return false;
            }
        },
        async fetchAllChefs(search = '') {
            this.loading = true;
            try {
                // 传给后端
                const res = await api.get('/users/chefs', {
                    params: { search }
                });
                this.chefs = res.data;
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
    }
});