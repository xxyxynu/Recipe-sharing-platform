<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-xl font-bold text-emerald-600">Recipy</router-link>
            <div class="ml-10 flex space-x-4">
              <router-link to="/" class="text-gray-700 hover:text-emerald-600">Home</router-link>
              <router-link to="/chefs" class="text-gray-700 hover:text-emerald-600">Chefs</router-link>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <template v-if="authStore.isAuthenticated">
              <router-link to="/create-recipe"
                class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition">
                + Create Recipe
              </router-link>
              <router-link to="/profile" v-if="authStore.user" class="text-gray-600">Hi, {{ authStore.user.username
              }}</router-link>
              <button @click="handleLogout" class="text-gray-500 hover:text-red-500">Logout</button>
            </template>
            <template v-else>
              <router-link to="/login" class="text-gray-700 hover:text-emerald-600">Login</router-link>
              <router-link to="/register"
                class="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition">Register</router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- 页面内容 -->
    <main class="flex-grow bg-gray-50">
      <router-view />
    </main>

    <footer class="bg-white border-t mt-auto">
      <div class="max-w-7xl mx-auto py-6 px-4 text-center text-gray-500">
        &copy; 2023 Recipy Platform.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  if (authStore.token) {
    authStore.fetchUser();
  }
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>