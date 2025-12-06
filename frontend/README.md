# Employee Shift Board - Frontend

## Overview

This is the frontend application for the Employee Shift Board. It's built with React, Vite, and TailwindCSS, providing a modern and responsive user interface for managing employee shifts.

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` by default (Vite's default port).

### Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Environment Variables

You can configure the API base URL using environment variables.

Create a `.env` file in the frontend directory:

```
VITE_API_BASE_URL=http://localhost:3001
```

If not set, it defaults to `http://localhost:3001`.

**Note**: In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

## Pages Overview

### 1. Login Page (`/`)

- Email and password input fields
- Authenticates users against the backend API
- On successful login:
  - Stores JWT token in `localStorage`
  - Stores user role in `localStorage`
  - Stores user ID in `localStorage`
  - Redirects to `/dashboard`

**Login Credentials:**

- **Admin**: 
  - Email: `hire-me@anshumat.org`
  - Password: `HireMe@2025!`

- **Regular User**: 
  - Email: `user@example.com`
  - Password: `password123`

### 2. Dashboard (`/dashboard`)

- Protected route (requires authentication)
- Fetches shifts from the backend API
- **Admin users**: See all shifts from all employees
- **Regular users**: See only their own shifts
- Displays shifts in a responsive table format
- Shows:
  - Employee ID
  - Date
  - Start Time
  - End Time
  - Duration (hours)

### 3. Add Shift Page (`/add-shift`)

- Admin-only route
- Form fields:
  - Employee ID (number input)
  - Date (date picker, YYYY-MM-DD format)
  - Start Time (time picker, HH:mm format)
  - End Time (time picker, HH:mm format)
- Validates input client-side
- Shows backend validation errors
- Redirects to dashboard on successful creation

## Components

### Navbar

- Displays application title/logo
- Shows "Add Shift" button (admin only)
- Shows "Logout" button
- Only visible when user is authenticated

## API Integration

The application uses the `api.js` helper file which:

- Automatically attaches the JWT token from `localStorage` to all requests
- Handles authentication headers
- Provides a clean API interface for:
  - Authentication (`authAPI.login()`)
  - Shifts management (`shiftsAPI.getAll()`, `shiftsAPI.create()`)

### API Helper Functions

```javascript
// Login
await authAPI.login(email, password)

// Get all shifts (filtered by role)
await shiftsAPI.getAll()

// Create a new shift (admin only)
await shiftsAPI.create({
  employee_id: 1,
  date: '2025-01-15',
  start_time: '09:00',
  end_time: '17:00'
})
```

## Authentication Flow

1. User enters credentials on login page
2. Frontend sends credentials to `/auth/login`
3. Backend returns JWT token and user info
4. Frontend stores token and role in `localStorage`
5. All subsequent API requests include the token in the `Authorization` header
6. Protected routes check for token presence
7. Admin routes check for `admin` role

## Routing

- `/` - Login page (public)
- `/dashboard` - Dashboard (protected, all users)
- `/add-shift` - Add shift form (protected, admin only)

Routes are protected using React Router and check:
- Token presence for authentication
- Role for authorization (admin routes)

## Business Rules (Enforced by Backend)

1. **Minimum Shift Duration**: Shifts must be at least 4 hours
2. **No Overlapping Shifts**: Same employee cannot have overlapping shifts on the same date
3. **Role-Based Access**:
   - Admins can view all shifts and create shifts
   - Regular users can only view their own shifts

## File Structure

```
frontend/
├── index.html              # HTML entry point
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Main app component with routing
│   ├── index.css         # Global styles with Tailwind imports
│   ├── api.js            # API helper functions
│   ├── pages/
│   │   ├── Login.jsx     # Login page
│   │   ├── Dashboard.jsx # Dashboard page
│   │   └── AddShift.jsx  # Add shift page (admin)
│   └── components/
│       └── Navbar.jsx    # Navigation bar component
└── README.md             # This file
```

## Styling

The application uses TailwindCSS for all styling. Key features:

- Responsive design (mobile-first)
- Modern UI components
- Consistent color scheme
- Accessible form elements
- Loading states and error messages

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure:
1. Backend server is running
2. Backend CORS is properly configured
3. API base URL matches backend server URL

### Authentication Issues

- Check that token is being stored in `localStorage`
- Verify token is included in API requests (check browser DevTools Network tab)
- Ensure backend server is running and accessible

### Build Issues

- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version compatibility (v14+)

## Development Notes

- The application uses React hooks for state management
- JWT tokens are stored in `localStorage` (consider using httpOnly cookies for production)
- Error handling is implemented at both component and API levels
- Form validation happens both client-side and server-side

