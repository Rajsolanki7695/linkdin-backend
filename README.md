# LinkedIn Clone - Backend API

A robust, scalable Node.js backend for a LinkedIn-style social networking application. Built with Express, MongoDB, and Socket.IO, this API handles secure Google OAuth authentication, social graph relationships (Follow/Unfollow), post management with media uploads, and real-time messaging with strict authorization guards.

## Features

* **Authentication:** Secure login using Google OAuth 2.0 (Passport.js) and JWT session management.
* **User Profiles:** Profile generation, bio/headline updates, and Cloudinary-backed avatar uploads.
* **Social Graph:** Follow/Unfollow mechanics with aggregate follower/following counters.
* **Feed & Posts:** Complete CRUD operations for posts, integrated image uploads, and Like/Unlike toggles.
* **Real-Time Chat:** Socket.IO powered messaging. 
* **Strict Authorization:** 
  * Users can only edit/delete their own posts.
  * *Follow-Guard:* Users can only initiate or receive chats from accounts they follow.

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Real-Time Engine:** Socket.IO
* **Authentication:** Passport.js (Google OAuth20) & JSON Web Tokens (JWT)
* **File Storage:** Cloudinary & Multer (Memory Storage)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description |
| :--- | :--- |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS & OAuth redirects (e.g., `http://localhost:5173`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens |
| `JWT_EXPIRES_IN` | Token expiration time (e.g., `7d`) |
| `GOOGLE_CLIENT_ID` | Google Cloud Console OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console OAuth Client Secret |
| `GOOGLE_CALLBACK_URL` | e.g., `http://localhost:5000/api/v1/auth/google/callback` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary account API key |
| `CLOUDINARY_API_SECRET`| Cloudinary account API secret |

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
