# ✨ SayLink — Modern Social Media Platform

A sleek, glassmorphic social media web application built with **React**, **Vite**, and **Vanilla CSS**. Designed around a premium **Sunset Amber & Warm Charcoal** aesthetic (0% Blue, 0% Purple) with full Light/Dark mode support.

[![Live App](https://img.shields.io/badge/Live_App-SayLink-f59e0b?style=for-the-badge&logo=render)](https://saylink.onrender.com)
[![Backend Repo](https://img.shields.io/badge/Backend-Repository-141416?style=for-the-badge&logo=github)](https://github.com/Sahil-Ghorpade/saylink-backend)

---

## 🎨 Design & Aesthetic System

- **Sunset Amber Palette:** Rich `#f59e0b` → `#ea580c` brand gradients, Emerald Green (`#10b981`) positive actions, Crimson Rose (`#e11d48`) badges & likes. Zero blue and zero purple.
- **Glassmorphism:** Translucent elevated glass cards (`backdrop-filter: blur(16px)`), subtle border highlights, and ambient hover effects.
- **Dark / Light Mode Toggle:** Seamless 1-click theme switching with persistent state saved in `localStorage`.
- **Instagram-Style Circular Stories:** `60px x 60px` circular avatars with Instagram sunrise gradient ring badges and hold-to-pause full-screen story viewer.
- **In-App Glass Dialogs:** Custom non-blocking confirmation modals replacing browser `window.confirm()` popups.

---

## 📱 Application Features

- **🏠 Dynamic Feed:** Post cards with author avatars, high-contrast usernames, like toggles, comment slide-over panel, post sharing, and owner 3-dots actions.
- **📖 Full-Screen Story Viewer:** Tap to view, hold-to-pause with visual indicator, multi-segment progress bars, viewer list sheet for story owners, and direct message replies.
- **📸 Post Creation Page:** Drag-and-drop file upload dropzone, live image preview, caption input, and instant upload feedback.
- **💬 Real-Time Direct Messaging:** Live chat powered by WebSockets (`Socket.io`), typing indicators, message delivery & seen statuses (`✓✓`), and post sharing previews in chat.
- **🔍 Auto-Debounced User Search:** Search users by username or display name with clear button and instant glass profile cards.
- **👤 Profile Page:** Interactive profile headers, follower/following counters, active story rings, action pills (Follow, Message, Edit Profile), and post tile hover overlays showing like & comment counts.
- **⚙️ Profile Settings:** Edit name, username, bio, privacy status (Public vs Private account), and profile photo with automatic Cloudinary cleanup.
- **🔔 Notification Center:** Categorized notification list with custom type badges (Likes, Comments, Follows, Requests) and relative timestamps ("2m ago").
- **🚫 404 Catch-All Page:** Animated compass error card for non-existent routes with options to go back or return home.

---

## 🛠️ Tech Stack

- **Frontend Core:** React 19, React Router DOM v7, Vite
- **Styling:** Vanilla CSS3 (Custom Tokens, CSS Variables, Flexbox/Grid, Animations)
- **Icons:** Bootstrap Icons (`bootstrap-icons`)
- **Real-time WebSockets:** Socket.io Client (`socket.io-client`)
- **Notifications:** Custom Toast & Context Providers (`ToastContext`, `ThemeContext`, `AuthContext`)

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8080
```

*For production deployment, set `VITE_API_URL` to your live backend domain.*

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Lint code for errors
npm run lint

# Build production bundle
npm run build
```

---

## 🔗 Repository Links

- **Frontend Repo:** [SayLink Frontend](https://github.com/Sahil-Ghorpade/saylink-frontend)
- **Backend Repo:** [SayLink Backend](https://github.com/Sahil-Ghorpade/saylink-backend)
- **Live App:** [SayLink Web App](https://saylink.onrender.com)
