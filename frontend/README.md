# Task Management Application - Frontend

## 📁 Project Structure

```
src/
├── main.jsx            # React application initialization
├── App.jsx             # Root component with routing and layout
├── App.css             # Global application styles
├── index.css           # Base CSS reset and utilities
│
├── api/                # API communication layer
│   └── client.js       # Axios configuration and API request functions
│
├── assets/             # Images, videos, and media files
│
├── context/            # React Context for global state management
│   └── AuthContext.jsx # Authentication state and user session context
│
├── components/         # Reusable React components
│   ├── Button.jsx           # Reusable button component with variants
│   ├── Input.jsx            # Reusable input field component
│   ├── Modal.jsx            # Modal dialog component for popups
│   ├── Navbar.jsx           # Top navigation bar component
│   ├── Sidebar.jsx          # Side navigation menu component
│   └── TaskListView.jsx     # Task list display component
│
└── pages/              # Full page components (routes)
    ├── Landing.jsx          # Landing/home page for unauthenticated users
    ├── Login.jsx            # User login page
    ├── Register.jsx         # User registration page
    ├── Dashboard.jsx        # Main dashboard showing projects and overview
    ├── ProjectsList.jsx     # List of all user projects
    ├── ProjectView.jsx      # Individual project view with Kanban board
    ├── Tasks.jsx            # Task management view
    └── AdminDashboard.jsx   # Admin-specific dashboard and controls
```

## 🔧 Root Configuration Files

- **index.html** - HTML entry point
- **package.json** - Node.js dependencies and project metadata
- **vite.config.js** - Vite build tool configuration
- **eslint.config.js** - ESLint code quality rules
- **vercel.json** - Deployment configuration for Vercel

## 📚 Tech Stack

- React.js (v19)
- Vite - Next generation frontend build tool
- Tailwind CSS (v4) - Utility-first CSS framework
- React Router DOM - Client-side routing
- @hello-pangea/dnd - Drag and drop functionality
- Lucide React - Icon library
- Axios - HTTP client for API requests
