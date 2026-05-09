# Local Setup & Deployment Guide

This document provides step-by-step instructions to set up the Task Management Web Application on your local machine and details for deployment.

## 📋 Prerequisites

Ensure you have the following installed on your system:
- **Python 3.9+**
- **Node.js 18+**
- Git (optional, for cloning)

## 🛠 1. Backend Setup

The backend is built with FastAPI and Python.

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment**:
   ```bash
   # On Windows
   python -m venv venv
   # Activate the environment
   venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server**:
   ```bash
   uvicorn main:app --reload
   ```
   *The API will be available at `http://localhost:8000`. You can access the Swagger UI documentation at `http://localhost:8000/docs`.*

## 💻 2. Frontend Setup

The frontend is a React application built with Vite.

1. **Navigate to the frontend directory**:
   ```bash
   # Open a new terminal tab/window
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The frontend will run at `http://localhost:5173`. Open this URL in your browser to access the app.*

## 🚀 Deployment

The application is designed to be easily deployable on modern cloud platforms.

**Deployment Link:**
> [Live Application Demo](https://your-deployment-link.com) 
*(Replace the above URL with the actual deployment link once hosted)*

### Deployment Recommendations
- **Frontend**: Platforms like Vercel, Netlify, or Cloudflare Pages are ideal for hosting the Vite React app.
- **Backend**: You can host the FastAPI server on platforms such as Render, Railway, or Heroku. Ensure you update the database configuration from SQLite to PostgreSQL for production environments.

## 🧪 Demo Preparation

To fully test the application features locally:
1. Create a primary user (e.g., `alice@example.com`).
2. Open an Incognito/Private window and create a secondary user (e.g., `bob@example.com`).
3. As `alice`, create a new project and add several tasks.
4. Invite `bob` to collaborate on the project using their email.
5. You can now test real-time collaboration, drag-and-drop functionality, and assignment changes.
