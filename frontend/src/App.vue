<template>
  <div class="app">
    <Navbar />

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <p>© 2025 Recipe Sharing Community</p>
    </footer>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fafafa;
  color: #333;
  font-family: 'Poppins', sans-serif;
}

.logo {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ff6b81;
}

.nav-links a {
  margin-left: 20px;
  text-decoration: none;
  color: #555;
  font-weight: 500;
}

.nav-links a:hover {
  color: #ff6b81;
}

/* 页面内容 */
.main-content {
  flex: 1;
  padding: 24px 40px;
}

/* 底部 */
.footer {
  text-align: center;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #eee;
  font-size: 0.9rem;
  color: #777;
}
</style>
