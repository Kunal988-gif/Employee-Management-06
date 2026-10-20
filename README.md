# Employee Leave Management System

A full-stack web application built with Node.js, Express, MongoDB Atlas, and React. Employees can register, check their leave balances, and apply for leaves. Admins can manage leave types, approve or reject leave applications, and view dashboard statistics.

## Features

### Employee
- Register and login with JWT authentication
- Check available leave balances for each leave type
- Apply for leave (automatically excludes Sundays from day count)
- Prevents applying for overlapping dates or when balance is insufficient
- View personal leave history, status, and admin remarks
- Cancel pending leave requests

### Admin
- Dashboard showing pending requests, employees on leave today, and department stats
- Review pending leave requests (approve or reject with remarks)
- Leave balance gets deducted when a request is approved
- Add, edit, view, and disable/delete leave types
- Cannot delete leave types that already have requests linked to them

## Tech Stack

- **Frontend**: React (Vite), React Router, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Environment**: dotenv, cors

## Project Structure

```text
assignment-06/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Setup and Installation

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)

### 2. Backend Setup
1. Open a terminal and go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your MongoDB connection string and JWT secret:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
4. Seed the initial admin account:
   ```bash
   npm run create-admin
   ```
   *Default Admin credentials:*
   - **Email:** `admin@company.com`
   - **Password:** `Admin@12345`

5. Start the backend server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. In another terminal, go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Verify the API URL:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```
4. Start the frontend app:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

## Deployment

### Backend (Render)
- Build Command: `npm install`
- Start Command: `node server.js`
- Root Directory: `backend`
- Environment Variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV`

### Frontend (Vercel)
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`
