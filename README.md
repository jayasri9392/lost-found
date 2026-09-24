# Intelligent Lost & Found Network (ILFN) - lost-found

> **"Find what was lost. Return what was found."**

**Intelligent Lost & Found Network (ILFN)** is a modern, scalable full-stack MERN application built to bridge the gap between misplaced personal belongings and their rightful owners. Engineered with clean separation of concerns, modern visual aesthetics, and high-security standards, ILFN is ready for production and future intelligent matching modules.

---

## 1. Project Overview

Misplacing personal valuables—such as electronics, IDs, wallets, keys, and accessories—often results in permanent loss due to fragmented reporting channels. ILFN provides a centralized, community-driven platform where items can be categorized, reported, verified, and claimed.

This initial release delivers:
- Production-grade **MongoDB Atlas** cloud database integration with connection pooling and DNS fallback.
- Complete **JWT-based Authentication** system with bcrypt password encryption.
- Role-based foundations (`user` and `admin`).
- Responsive, modern frontend user interface styled with **Tailwind CSS** featuring a deep navy and cyan theme.
- Modular, service-oriented architecture designed to scale seamlessly into item reporting and AI matching phases.

---

## 2. Technology Stack

### Frontend
- **Framework**: [React.js](https://react.dev/) (built with Vite for high-performance HMR)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design tokens (Navy, Slate, Cyan, Teal)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) with request/response authorization interceptors

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (LTS)
- **Server Framework**: [Express.js](https://expressjs.com/)
- **Database & ODM**: [MongoDB Atlas](https://www.mongodb.com/atlas) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [JSON Web Tokens (JWT)](https://jwt.io/) & [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- **Security & Config**: [CORS](https://github.com/expressjs/cors), [Dotenv](https://github.com/motdotla/dotenv)

---

## 3. Project Structure

```
lost-found-projectFSD/
│
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── assets/             # Branding assets and illustrations
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx   # Route guard for authenticated users
│   │   │   └── common/
│   │   │       ├── Alert.jsx            # Dynamic toast/alert messages
│   │   │       ├── Footer.jsx           # Platform footer with tagline & roadmap
│   │   │       ├── Loader.jsx           # Clean spinner & loading indicators
│   │   │       └── Navbar.jsx           # Responsive header with dynamic auth states
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Global React Context for authentication
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # High-impact landing page
│   │   │   ├── Login.jsx                # Centered login form with validation
│   │   │   ├── Register.jsx             # User registration with password match checks
│   │   │   ├── Profile.jsx              # Protected user profile & activity center
│   │   │   └── NotFound.jsx             # 404 error page
│   │   ├── services/
│   │   │   ├── api.js                   # Axios client with JWT interceptor
│   │   │   └── authService.js           # API calls for login, register, and profile
│   │   ├── App.jsx                      # Main app component & route definitions
│   │   ├── index.css                    # Tailwind imports and design tokens
│   │   └── main.jsx                     # React DOM root entry point
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Application (Node.js + Express)
│   ├── config/
│   │   └── db.js               # MongoDB Atlas connection with resilient DNS
│   ├── controllers/
│   │   └── authController.js   # register, login, and getMe controller logic
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification ('protect') & role guard ('authorize')
│   │   └── errorMiddleware.js  # Global error handler and 404 catcher
│   ├── models/
│   │   └── User.js             # Mongoose User schema with pre-save hashing
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   └── healthRoutes.js     # /api/health check route
│   ├── .env                    # Environment secrets (ignored by Git)
│   ├── .env.example            # Environment template
│   ├── package.json
│   ├── server.js               # Server entry point
│   └── test-auth.js            # Automated integration test suite
│
├── .gitignore
└── README.md
```

---

## 4. Environment Variables Configuration

### Backend (`server/.env`)
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ilfn_db?retryWrites=true&w=majority

# JWT Authentication Secret & Expiration
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d

# Frontend Client URL for CORS
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 5. MongoDB Atlas Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Under **Database Access**, create a user with read/write privileges.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere) or your current public IP address.
4. Obtain the connection string from **Connect > Drivers**, and insert your username and password into `server/.env`.

---

## 6. Installation & Quick Start

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 3. Start Backend Server
```bash
cd ../server
npm start
# Server runs at http://localhost:5000
# API Health: http://localhost:5000/api/health
```

### 4. Start Frontend Client
```bash
cd ../client
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 7. Authentication API Reference

### Health Check
- **`GET /api/health`**
  - **Access**: Public
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Intelligent Lost & Found Network API is operational",
      "timestamp": "2026-09-23T17:23:41.610Z",
      "status": "UP",
      "database": "connected",
      "version": "1.0.0"
    }
    ```

### Register New User
- **`POST /api/auth/register`**
  - **Access**: Public
  - **Body**:
    ```json
    {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "Password123!",
      "confirmPassword": "Password123!"
    }
    ```
  - **Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Account created successfully! Welcome to ILFN.",
      "data": {
        "_id": "673f8a...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user",
        "createdAt": "2026-09-23T...",
        "token": "eyJhbGciOiJIUz..."
      }
    }
    ```

### User Login
- **`POST /api/auth/login`**
  - **Access**: Public
  - **Body**:
    ```json
    {
      "email": "jane@example.com",
      "password": "Password123!"
    }
    ```
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Login successful! Welcome back.",
      "data": {
        "_id": "673f8a...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user",
        "createdAt": "2026-09-23T...",
        "token": "eyJhbGciOiJIUz..."
      }
    }
    ```

### Get Authenticated User Profile
- **`GET /api/auth/me`**
  - **Access**: Private (Requires `Authorization: Bearer <token>` header)
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "User profile retrieved successfully",
      "data": {
        "_id": "673f8a...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user",
        "createdAt": "2026-09-23T...",
        "updatedAt": "2026-09-23T..."
      }
    }
    ```

---

## 8. Automated Integration Testing

To execute the 10 automated test suites covering registration, validation, duplicate email prevention, password verification, token generation, protected routes, and database cleanup:

```bash
cd server
node test-auth.js
```

Sample test output:
```text
=======================================================
  RUNNING ILFN AUTHENTICATION INTEGRATION TEST SUITE   
=======================================================

✓ Connected to MongoDB Atlas for testing
✓ Test server running on port 5001

[PASS] 1. GET /api/health returned 200 OK (UP, DB: connected)
[PASS] 2. POST /api/auth/register rejected missing fields (400)
[PASS] 3. POST /api/auth/register rejected password mismatch (400)
[PASS] 4. POST /api/auth/register created user (201 Created, received JWT)
[PASS] 5. POST /api/auth/register prevented duplicate email (400 Bad Request)
[PASS] 6. POST /api/auth/login rejected wrong password (401 Unauthorized)
[PASS] 7. POST /api/auth/login authenticated successfully (200 OK)
[PASS] 8. GET /api/auth/me rejected request without token (401 Unauthorized)
[PASS] 9. GET /api/auth/me returned authenticated user profile (200 OK, password protected)
[PASS] 10. Successfully cleaned up test user from MongoDB Atlas

=======================================================
  ALL 10 BACKEND INTEGRATION TESTS PASSED PERFECTLY!   
=======================================================
```

---

## 9. Future Modules Roadmap

The architecture is prepared for immediate modular expansion in subsequent phases:

1. **Lost Item Reporting**: Detailed submission forms with category, date, location pin, and photo uploads.
2. **Found Item Registry**: Secure logging for community discovery.
3. **Item Search & Filtering**: Multi-criteria search by category, location, and date range.
4. **Intelligent Matching Engine**: Cosine similarity and geographic proximity algorithms to recommend potential lost-found pairings.
5. **Claim Management & Verification**: Security questions and proof-of-ownership verification flow.
6. **Notifications & Alerts**: Automated email / in-app notifications on matching item discoveries.
7. **Admin Dashboard**: Content moderation and claim audit logging.

---

## 10. Production Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. **Root Directory**: `client`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: Your deployed backend API URL (e.g. `https://your-backend.onrender.com/api`)
5. SPA redirect rules are pre-configured via `client/vercel.json` and `client/public/_redirects`.

### Backend Deployment (Render / Railway)
1. **Root Directory**: `server`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `PORT`: Auto-assigned by host (defaults to `5000`)
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secure random string for JWT signing
   - `JWT_EXPIRE`: e.g. `7d`
   - `CLIENT_URL`: Your deployed frontend URL (e.g. `https://your-app.vercel.app`)

