<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 🕊️ ChurpApp

**ChurpApp** is a minimalist, modern real-time chat application built with **React** and **Firebase**. It supports direct user-to-user messaging using usernames, includes recent chat lists, dark mode, new message badges, and a sleek, responsive UI.

---

## 🔥 Features

- 🔐 **Authentication** (Sign up/login using username & password)
- 👤 **Custom Usernames**
- 💬 **Real-time Chat**
- 🌙 **Dark Mode Toggle**
- 📨 **Unread/New Message Badge**
- 📃 **Recent Chats List**
- 📱 **Responsive Design**
- 🔒 **Secure with Firebase Auth & Firestore Rules**

---

## 🚀 Live Demo

> link to demo

---

## ⚙️ Tech Stack

- React (with Hooks)
- Vite
- Firebase (Auth + Firestore)
- Modern CSS

---

## 🛠️ Installation

```bash
# 1. Clone the repository
git clone https://github.com/anuragxtiwari/churpapp.git

# 2. Navigate into the project
cd churpapp

# 3. Install dependencies
npm install

# 4. Run the app
npm run dev
```
## 🔐 Firebase Setup
Create a firebase/config.js file with your Firebase credentials:

// firebase/config.js
```bash
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... other keys
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```
## 🧾 Firestore Rules
```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId}/userChats/{chatId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null;
    }

    match /usernames/{username} {
      allow read, write: if request.auth != null;
    }
  }
}
```
## 📁 Folder Structure
```bash
src/
├── pages/
│   └── ChatPage.jsx
│   └── Login.jsx
│   └── Signup.jsx
├── firebase/
│   └── config.js
├── App.jsx
├── index.css
├── App.css
└── main.jsx
└── index.html
```
## 📄 License
This project is open-source and free to use for personal or educational purposes.
>>>>>>> ff39efa5a42a16663e823aa308fd73e0501cc358
