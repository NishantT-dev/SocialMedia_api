# Social Media Backend API
### A Node.js + Express + MongoDB backend for a social media application.
### It supports user authentication, posts, comments, likes

## Features
1. User Authentication: Signup & login with salted + hashed passwords (PBKDF2 + crypto).
2. JWT Security: Token-based authentication with expiry.
3. Users: Create, update, soft delete, and fetch users.
4. Posts: Create, update, soft delete, and fetch posts.
5. Comments: Add, delete, and fetch comments linked to posts.
6. Likes: Like/unlike posts.
7. Notifications: Trigger notifications when someone likes, comments, or follows.
8. Logging: Winston logger with file + console outputs.
