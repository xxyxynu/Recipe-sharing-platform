<template>
    <div class="auth-page">
        <div class="auth-card">
            <div class="logo">
                <img src="../assets/logo.jpg" alt="Logo" />
            </div>
            <h2>Create Account</h2>
            <p class="subtitle">Sign up to get started</p>

            <form @submit.prevent="register">
                <div class="input-group">
                    <User class="icon" />
                    <input v-model="name" type="text" placeholder="Full Name" required />
                </div>

                <div class="input-group">
                    <Mail class="icon" />
                    <input v-model="email" type="email" placeholder="Email" required />
                </div>

                <div class="input-group">
                    <Lock class="icon" />
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password"
                        required />
                    <span class="toggle" @click="showPassword = !showPassword">
                        <component :is="showPassword ? EyeOff : Eye" class="eye-icon" />
                    </span>
                </div>

                <div class="input-group">
                    <Lock class="icon" />
                    <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
                        placeholder="Confirm Password" required />
                    <span class="toggle" @click="showConfirmPassword = !showConfirmPassword">
                        <component :is="showConfirmPassword ? EyeOff : Eye" class="eye-icon" />
                    </span>
                </div>

                <button type="submit">Register</button>
            </form>

            <p class="signup">
                Already have an account? <a href="/login">Login</a>
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-vue-next";
import { registerAPI } from "../api/user";
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const register = async () => {
    if (password.value !== confirmPassword.value) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const res = await registerAPI({
            username: name.value,
            email: email.value,
            password: password.value
        })

        console.log("✅ 注册成功", res)
        // userStore.setUserInfo(res)
        router.push('/login')
    } catch (err) {
        console.error("register error", err)
    }
}

</script>

<style scoped>
.auth-page {
    display: flex;
    align-items: center;
    justify-content: center;
}

.auth-card {
    background: #fff;
    padding: 40px 30px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 380px;
    text-align: center;
}

.logo img {
    width: 80px;
    margin-bottom: 20px;
}

h2 {
    margin-bottom: 6px;
    font-size: 28px;
    font-weight: 700;
    color: var(--text-color);
}

.subtitle {
    margin-bottom: 20px;
    color: #777;
    font-size: 14px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input-group {
    position: relative;
}

.input-group .icon {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: var(--btn-color);
    width: 18px;
    height: 18px;
}

.input-group input {
    width: 100%;
    padding: 10px 12px 10px 36px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 14px;
    transition: 0.3s;
}

.input-group input:focus {
    outline: none;
    border-color: var(--btn-color);
    box-shadow: 0 0 5px rgba(255, 127, 80, 0.5);
}

.input-group .toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 16px;
}

.eye-icon {
    width: 18px;
    height: 18px;
    color: #888;
    transform: translateY(15%);
}

button {
    background: var(--btn-color);
    color: #fff;
    padding: 12px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: var(--btn-color-hover);
    transform: translateY(-2px);
}

.signup {
    margin-top: 15px;
    font-size: 13px;
    color: #555;
}

.signup a {
    color: var(--secondary-color);
    text-decoration: none;
    font-weight: 600;
}

.signup a:hover {
    text-decoration: underline;
}

@media (max-width: 480px) {
    .auth-card {
        padding: 30px 20px;
    }
}
</style>
