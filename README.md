# Recipe Sharing Community 🍳

A full-stack web application built with Vue 3 and Node.js where users can discover, share, and manage cooking recipes. This project was developed as a final assignment to demonstrate mastery of the Vue ecosystem.

## 🚀 Live Demo

**View the deployed project here:**  
👉 **[https://recipe-sharing-platform-ochre-zeta.vercel.app](https://recipe-sharing-platform-ochre-zeta.vercel.app)**

## 🛠 Tech Stack

*   **Frontend:** Vue 3 (Composition API), Vite, Tailwind CSS
*   **State Management:** Pinia
*   **Routing:** Vue Router
*   **Backend:** Node.js, Express
*   **Database:** MongoDB Atlas
*   **Testing:** Vitest

## ✨ Key Features

*   **Authentication:** User registration and login with JWT.
*   **Recipe Management:** Create, edit, and delete recipes with image uploads.
*   **Social Interaction:** Follow chefs, "Like" (Favorite) recipes, and leave comments/reviews.
*   **Search & Discovery:** Filter recipes by category, search by name, and sort by popularity.
*   **User Profiles:** Manage avatars, bio, and view personal recipe collections.

## 📦 How to Run Locally

If you want to run this project on your local machine:

### 1. Backend
```bash
cd back
npm install
# Create a .env file with: PORT, CONNECTION_STRING, JWT_SECRET
npm run dev
