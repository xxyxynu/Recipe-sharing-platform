import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import RecipeDetailView from "../views/RecipeDetailView.vue";
import AddRecipeView from "../views/AddRecipeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import RecipesView from "../views/RecipesView.vue";
import ProfileView from "../views/ProfileView.vue";
import EditProfileView from "@/views/EditProfileView.vue";

const routes = [
  { path: "/", component: HomeView },
  { path: "/recipe/:id", component: RecipeDetailView },
  { path: "/add", component: AddRecipeView },
  { path: "/login", component: LoginView },
  { path: "/register", component: RegisterView },
  { path: "/recipes", component: RecipesView },
  { path: "/profile", component: ProfileView },
  { path: '/profile/edit', component: EditProfileView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
