import { defineStore } from 'pinia';
import api from '../utils/api';
import { useAuthStore } from './auth';

export const useRecipeStore = defineStore('recipe', {
    state: () => ({
        recipes: [],
        myRecipes: [],
        myFavorites: [],
        total: 0,       // 总数，用于分页
        page: 1,        // 当前页
        loading: false,
        error: null,
        currentRecipe: null // 👈 🔴 必须添加这一行！详情页的数据存在这里
    }),

    actions: {
        async createRecipe(recipeData) {
            this.loading = true;
            this.error = null;

            try {
                // 1. 构建 FormData 对象
                const formData = new FormData();

                // 2. 添加普通字段
                formData.append('title', recipeData.title);
                formData.append('description', recipeData.description);
                formData.append('category', recipeData.category);
                formData.append('prepTime', recipeData.prepTime);
                formData.append('cookTime', recipeData.cookTime);
                formData.append('servings', recipeData.servings);
                formData.append('calories', recipeData.calories);

                // 3. 处理数组
                recipeData.ingredients.forEach(item => {
                    if (item.value) formData.append('ingredients', item.value);
                });

                recipeData.instructions.forEach(item => {
                    if (item.value) formData.append('instructions', item.value);
                });

                // 4. 处理 Tags
                const tagValues = recipeData.tags.map(t => t.value).filter(t => t);
                formData.append('tags', JSON.stringify(tagValues));

                // 5. 处理图片文件
                if (recipeData.imageFile) {
                    formData.append('image', recipeData.imageFile);
                }

                // 6. 发送请求
                const res = await api.post('/recipes', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                // 成功后把新菜谱加到本地列表最前面
                // (你之前的代码这里写了两遍，我删掉了一遍)
                this.recipes.unshift(res.data);

                return res.data;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to create recipe';
                return null;
            } finally {
                this.loading = false;
            }
        },

        async fetchAllRecipes(page = 1, search = '', category = '', sort = 'latest') {
            this.loading = true;
            try {
                const res = await api.get('/recipes/all', {
                    params: {
                        page,
                        search,
                        category,
                        sort // 👈 传给后端
                    }
                });

                if (page === 1) {
                    this.recipes = res.data.recipes;
                } else {
                    this.recipes = [...this.recipes, ...res.data.recipes];
                }

                this.total = res.data.total;
                this.page = page;
            } catch (err) {
                console.error(err);
                this.error = 'Failed to load recipes';
            } finally {
                this.loading = false;
            }
        },

        async fetchRecipeById(id) {
            this.loading = true;
            this.error = null;
            // 先清空上一个菜谱的数据，防止页面闪烁显示旧数据
            this.currentRecipe = null;

            try {
                const res = await api.get(`/recipes/${id}`);

                // 🛡️ 增加检查：防止后端返回错误对象时前端崩溃
                if (res.data.title === "Server error") {
                    throw new Error(res.data.message || "Server Error");
                }

                this.currentRecipe = res.data;
            } catch (err) {
                console.error(err);
                this.error = 'Failed to load recipe details';
                this.currentRecipe = null;
            } finally {
                this.loading = false;
            }
        },

        async toggleFavorite(recipeId) {
            const authStore = useAuthStore();
            const userId = authStore.user?.id || authStore.user?._id;

            if (!userId) return false;

            try {
                const res = await api.post(`/recipes/${recipeId}/favorite`);
                const isFavorited = res.data.isFavorited;

                // 1. 如果当前正在浏览详情页 (currentRecipe 存在且 ID 匹配)
                // 手动更新详情页的点赞状态 UI
                if (this.currentRecipe && this.currentRecipe._id === recipeId) {
                    if (!this.currentRecipe.favorites) this.currentRecipe.favorites = [];

                    if (isFavorited) {
                        if (!this.currentRecipe.favorites.includes(userId)) {
                            this.currentRecipe.favorites.push(userId);
                        }
                    } else {
                        this.currentRecipe.favorites = this.currentRecipe.favorites.filter(
                            id => id.toString() !== userId.toString()
                        );
                    }
                }

                // 2. 如果当前在 Profile 页面的 Favorites Tab
                // 如果取消收藏，应该把这个菜谱从列表中移除去
                if (!isFavorited) {
                    this.myFavorites = this.myFavorites.filter(r => r._id !== recipeId);
                }

                return true;
            } catch (err) {
                console.error("Toggle favorite failed", err);
                return false;
            }
        },

        async addReview(id, reviewData) {
            try {
                await api.post(`/recipes/${id}/reviews`, reviewData);
                await this.fetchRecipeById(id);
                return true;
            } catch (err) {
                return false;
            }
        },

        async fetchMyRecipes() {
            this.loading = true;
            try {
                const res = await api.get('/users/my-recipes');
                this.myRecipes = res.data;
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        // 2. 获取我收藏的菜谱
        async fetchMyFavorites() {
            this.loading = true;
            try {
                const res = await api.get('/users/favorites');
                this.myFavorites = res.data;
            } catch (err) {
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        // 3. 删除菜谱
        async deleteRecipe(id) {
            if (!confirm('Are you sure you want to delete this recipe?')) return false;
            try {
                await api.delete(`/recipes/${id}`);
                // 从本地列表中移除
                this.myRecipes = this.myRecipes.filter(r => r._id !== id);
                return true;
            } catch (err) {
                alert(err.response?.data?.message || 'Failed to delete');
                return false;
            }
        },

        // 4. 更新菜谱 (用于编辑页面)
        async updateRecipe(id, recipeData) {
            this.loading = true;
            try {
                // 构建 FormData (逻辑同 createRecipe)
                const formData = new FormData();
                formData.append('title', recipeData.title);
                formData.append('description', recipeData.description);
                // ... 其他字段 ...
                // 简化起见，这里假设你构建好了 formData (如果不传图片，后端逻辑可能需要微调)
                // 这里我们简单处理，假设 updateRecipeView 里会处理好 formData

                await api.put(`/recipes/${id}`, recipeData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Update failed';
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});