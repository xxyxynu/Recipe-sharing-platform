<template>
    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <h2>Sign in to your account</h2>
                <p>
                    Or
                    <router-link to="/register" class="link">create a new account</router-link>
                </p>
            </div>

            <div v-if="authStore.error" class="error-alert">
                <p>{{ authStore.error }}</p>
            </div>

            <form @submit.prevent="handleLogin" class="auth-form">
                <div class="input-group">
                    <label for="email" class="sr-only">Email address</label>
                    <input id="email" type="email" v-model="email" required placeholder="Email address"
                        class="input-top" />

                    <label for="password" class="sr-only">Password</label>
                    <input id="password" type="password" v-model="password" required placeholder="Password"
                        class="input-bottom" />
                </div>

                <BaseButton type="submit" :loading="authStore.loading" class="w-full">
                    Sign in
                </BaseButton>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
    const success = await authStore.login({ email: email.value, password: password.value });
    if (success) router.push('/');
};
</script>

<style scoped>
.auth-container {
    min-height: calc(100vh - 4rem);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
}

.auth-card {
    width: 100%;
    max-width: 28rem;
    /* max-w-md */
    background-color: var(--bg-white);
    padding: 2rem;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
}

.auth-header h2 {
    text-align: center;
    font-size: 1.875rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
}

.auth-header p {
    text-align: center;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

.link {
    font-weight: 500;
    color: var(--primary-color);
    text-decoration: none;
}

.link:hover {
    color: var(--primary-hover);
}

.error-alert {
    background-color: #fef2f2;
    border-left: 4px solid #ef4444;
    padding: 1rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    color: #b91c1c;
    font-size: 0.875rem;
}

.auth-form {
    margin-top: 2rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-md);
    margin-bottom: 1.5rem;
}

.input-group input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    font-size: 0.875rem;
    outline: none;
    box-sizing: border-box;
    /* 重要 */
}

.input-group input:focus {
    border-color: var(--primary-color);
    z-index: 10;
}

.input-top {
    border-top-left-radius: var(--radius-md);
    border-top-right-radius: var(--radius-md);
    margin-bottom: -1px;
}

.input-bottom {
    border-bottom-left-radius: var(--radius-md);
    border-bottom-right-radius: var(--radius-md);
}

.btn-primary {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: var(--radius-md);
    background-color: var(--primary-color);
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s;
}

.btn-primary:hover {
    background-color: var(--primary-hover);
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}
</style>