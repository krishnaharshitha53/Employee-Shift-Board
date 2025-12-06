# Employee Shift Board - Backend API

## Overview

This is the backend API for the Employee Shift Board application. It provides authentication and shift management endpoints using Node.js, Express, JWT, and a JSON file-based database.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **data.json** - File-based database (no external database required)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

### Environment Variables (Optional)

You can set the following environment variables:

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT token signing (default: 'your-secret-key-change-in-production')

Example:
```bash
$env:PORT=3001
$env:JWT_SECRET="my-secret-key"
npm start
```

## API Documentation

### Base URL

```
http://localhost:3001
```

### Authentication

All endpoints except `/login` require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### POST /login

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "hire-me@anshumat.org",
  "password": "HireMe@2025!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "hire-me@anshumat.org",
    "role": "admin"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid email or password
- `500` - Internal server error

#### GET /employees

Get all employees. Requires authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Admin User",
    "employee_code": "EMP001",
    "department": "Management",
    "user_id": 1
  },
  {
    "id": 2,
    "name": "John Doe",
    "employee_code": "EMP002",
    "department": "Operations",
    "user_id": 2
  }
]
```

**Error Responses:**
- `401` - Access token required
- `403` - Invalid or expired token
- `500` - Internal server error

#### POST /employees

Create a new employee (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "employee_code": "EMP003",
  "department": "IT"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "name": "Jane Smith",
  "employee_code": "EMP003",
  "department": "IT",
  "user_id": null
}
```

**Error Responses:**
- `400` - Missing required fields or employee code already exists
- `401` - Access token required
- `403` - Only admins can create employees, or invalid/expired token
- `500` - Internal server error

#### GET /shifts

Get shifts. Supports optional query parameters for filtering.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `employee` (optional) - Filter by employee ID
- `date` (optional) - Filter by date (YYYY-MM-DD)

**Examples:**
- `GET /shifts` - Get all shifts (admins see all, users see only their own)
- `GET /shifts?employee=1` - Get shifts for employee ID 1
- `GET /shifts?date=2025-01-15` - Get shifts for specific date
- `GET /shifts?employee=1&date=2025-01-15` - Get shifts for employee on specific date

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "employee_id": 1,
    "date": "2025-01-15",
    "start_time": "09:00",
    "end_time": "17:00",
    "duration": "8.00",
    "created_at": "2025-01-10T10:00:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Access token required
- `403` - Invalid or expired token
- `500` - Internal server error

**Note:** Normal users will only see their own shifts, while admins see all shifts.

#### POST /shifts

Create a new shift (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "employee_id": 1,
  "date": "2025-01-15",
  "start_time": "09:00",
  "end_time": "17:00"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "employee_id": 1,
  "date": "2025-01-15",
  "start_time": "09:00",
  "end_time": "17:00",
  "duration": "8.00",
  "created_at": "2025-01-10T10:00:00.000Z"
}
```

**Error Responses:**
- `400` - Missing required fields, invalid format, shift < 4 hours, or overlapping shift
- `401` - Access token required
- `403` - Only admins can create shifts, or invalid/expired token
- `500` - Internal server error

#### DELETE /shift/:id

Delete a shift by ID (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Shift ID to delete

**Response (200 OK):**
```json
{
  "message": "Shift deleted successfully"
}
```

**Error Responses:**
- `401` - Access token required
- `403` - Only admins can delete shifts, or invalid/expired token
- `404` - Shift not found
- `500` - Internal server error

## Business Rules

1. **Minimum Shift Duration**: All shifts must be at least 4 hours long.
2. **No Overlapping Shifts**: A single employee cannot have overlapping shifts on the same date.
3. **Role-Based Access**:
   - **Admin**: Can view all shifts, create shifts, and delete shifts
   - **User**: Can only view their own shifts

## Database Structure

The application uses `data.json` as a file-based database. The structure is as follows:

```json
{
  "users": [
    {
      "id": 1,
      "email": "hire-me@anshumat.org",
      "password": "<bcrypt hash>",
      "role": "admin",
      "employee_id": 1
    },
    {
      "id": 2,
      "email": "user@example.com",
      "password": "<bcrypt hash>",
      "role": "user",
      "employee_id": 2
    }
  ],
  "employees": [
    {
      "id": 1,
      "name": "Admin User",
      "employee_code": "EMP001",
      "department": "Management",
      "user_id": 1
    },
    {
      "id": 2,
      "name": "John Doe",
      "employee_code": "EMP002",
      "department": "Operations",
      "user_id": 2
    }
  ],
  "shifts": [
    {
      "id": 1,
      "employee_id": 1,
      "date": "2025-01-15",
      "start_time": "09:00",
      "end_time": "17:00",
      "duration": "8.00",
      "created_at": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

### Seed Users

The application comes with two pre-configured users:

1. **Admin User**:
   - Email: `hire-me@anshumat.org`
   - Password: `HireMe@2025!`
   - Role: `admin`
   - Employee ID: 1

2. **Regular User**:
   - Email: `user@example.com`
   - Password: `password123`
   - Role: `user`
   - Employee ID: 2

## Validation Rules

- **Date Format**: Must be in `YYYY-MM-DD` format
- **Time Format**: Must be in `HH:mm` format (24-hour)
- **Shift Duration**: Minimum 4 hours
- **Employee ID**: Must reference an existing employee
- **Overlapping Shifts**: Not allowed for the same employee on the same date

## File Structure

```
backend/
├── server.js          # Main server file
├── data.json          # File-based database
├── package.json       # Dependencies and scripts
├── routes/
│   ├── auth.js       # Authentication routes (login)
│   ├── employees.js  # Employee routes
│   ├── shifts.js     # Shift routes (GET, POST)
│   └── shift.js      # Shift routes (DELETE)
├── middleware/
│   └── auth.js       # JWT authentication middleware
└── README.md         # This file
```

## Notes

- The `data.json` file is read and written on every operation. In production, consider using a proper database.
- JWT tokens expire after 24 hours.
- Password hashes are generated using bcryptjs with a salt rounds of 10.
- All timestamps are stored in ISO 8601 format.

## Postman Collection

A Postman collection is included: `Employee_Shift_Board.postman_collection.json`

Import this collection into Postman to test all API endpoints. Make sure to:
1. Set the `baseUrl` variable to `http://localhost:3001`
2. Run the Login request first to get a token
3. The token will be automatically saved to the `token` environment variable
