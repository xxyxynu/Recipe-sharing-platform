<template>
    <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Already have an account?
                    <router-link to="/login" class="font-medium text-emerald-600 hover:text-emerald-500">
                        Sign in
                    </router-link>
                </p>
            </div>

            <!-- 错误提示 -->
            <div v-if="authStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div class="flex">
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{{ authStore.error }}</p>
                    </div>
                </div>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div class="mb-4">
                        <label for="username" class="sr-only">Username</label>
                        <input id="username" name="username" type="text" v-model="username" required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                            placeholder="Username" />
                    </div>
                    <div class="mb-4">
                        <label for="email-address" class="sr-only">Email address</label>
                        <input id="email-address" name="email" type="email" v-model="email" required
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                            placeholder="Email address" />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input id="password" name="password" type="password" v-model="password" required minlength="6"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                            placeholder="Password (min 6 chars)" />
                    </div>
                </div>

                <div>
                    <button type="submit" :disabled="authStore.loading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="authStore.loading">Creating account...</span>
                        <span v-else>Sign up</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
    const success = await authStore.register({
        username: username.value,
        email: email.value,
        password: password.value
    });

    if (success) {
        router.push('/');
    }
};
</script>