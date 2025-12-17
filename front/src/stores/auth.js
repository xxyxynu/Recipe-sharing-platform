import { defineStore } from 'pinia';
import api from '../utils/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('accessToken') || null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUser: (state) => state.user
    },

    actions: {
        async register(userData) {
            console.log('当前环境API地址:', import.meta.env.VITE_API_URL);

            this.loading = true;
            this.error = null;
            try {
                const res = await api.post('/users/register', userData);
                this.token = res.data.token;
                this.user = res.data.user;
                console.log("Registration response:", res.data);
                localStorage.setItem('accessToken', res.data.token);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Registration failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.post('/users/login', credentials);
                this.token = res.data.token;
                this.user = res.data.user;
                localStorage.setItem('accessToken', res.data.token);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Login failed';
                return false;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await api.post('/users/logout');
            } catch (err) {
                console.error("Logout error", err);
            } finally {
                this.user = null;
                this.token = null;
                localStorage.removeItem('accessToken');
            }
        },

        async fetchUser() {
            if (!this.token) return;

            try {
                const res = await api.get('/users/current-user');

                this.user = res.data.user;

            } catch (err) {
                console.error("Failed to fetch user on refresh", err);
                this.user = null;
                this.token = null;
                localStorage.removeItem('accessToken');
            }
        },

        async uploadAvatar(file) {
            this.loading = true;
            try {
                const formData = new FormData();
                formData.append('avatar', file);

                const res = await api.post('/users/upload-avatar', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                // 更新本地 user 数据
                if (this.user) {
                    this.user.avatar = res.data.avatar;
                }
                return true;
            } catch (err) {
                console.error('Avatar upload failed', err);
                return false;
            } finally {
                this.loading = false;
            }
        },

        // 2. 修改用户名
        async updateProfile(username) {
            this.loading = true;
            try {
                const res = await api.patch('/users/update-username', { username });
                if (this.user) {
                    this.user.username = res.data.user.username;
                }
                return true;
            } catch (err) {
                console.error('Update profile failed', err);
                return false;
            } finally {
                this.loading = false;
            }
        }
    }
});