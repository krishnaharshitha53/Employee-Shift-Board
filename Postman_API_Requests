# API Testing Screenshots (Postman)

Below are the Postman tests for all required REST API endpoints.
Each screenshot is from the actual working backend.

---

## 🔐 1. `POST /login` – User Authentication

Confirms that the login endpoint successfully returns a JWT token along with user details:
- `id`
- `email`
- `role`

The token is required for all further authenticated actions.

```json
{
  "token": "eyJhbGc...sQ",
  "user": {
    "id": 101,
    "email": "john.doe@example.com",
    "role": "admin"
  }
}
```

---

## 👥 2. `GET /employees` – Fetch All Employees

Retrieves a list of all employees stored in the system.  
This data is used for displaying employee records and assigning shifts.

```json
[
  {
    "id": 101,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "admin"
  },
  {
    "id": 102,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "employee"
  }
]
```

---

## 📝 3. `POST /shifts` – Create a New Shift

Creates a new shift by providing:

- `employee_id`
- `date`
- `start_time`
- `end_time`

Example Request:
```json
{
  "employee_id": 102,
  "date": "2025-12-01",
  "start_time": "09:00",
  "end_time": "17:00"
}
```
Example Response:
```json
{
  "id": 51,
  "employee_id": 102,
  "date": "2025-12-01",
  "start_time": "09:00",
  "end_time": "17:00",
  "duration": "8:00"
}
```

---

## 📅 4. `GET /shifts?employee=xx&date=xx` – Fetch Shifts

Fetches all shifts for a specific employee on a particular date.

**Example:** No shift exists for the selected date, so an empty array is returned.
```json
[]
```

---

## 🗑️ 5. `DELETE /shift/:id` – Delete a Shift

Deletes a shift using its ID.  
Server response:
```json
{
  "message": "Shift deleted successfully"
}
```

---

## 👤 Demo Login Credentials (Prototype Only)

These screenshots demonstrate how auto-generated login credentials are shown **once** when a new employee is created.

>⚠️ **Note:**  
> These are demo-only credentials.  
> In real use, credentials must be securely sent to the correct employee email.

### Demo Credentials – Example 1

Shows employee info and first-time login credentials.  
Credentials must be copied immediately upon display.

```json
{
  "employee": {
    "id": 103,
    "name": "Robert Lee",
    "email": "robert.lee@example.com"
  },
  "login": {
    "username": "robert.lee@example.com",
    "password": "TdjK8!ds"
  }
}
```

### Demo Credentials – Example 2

Another example of the login credentials UI.  
Credentials are shown **only once** for security reasons.

```json
{
  "employee": {
    "id": 104,
    "name": "Alice Brown",
    "email": "alice.brown@example.com"
  },
  "login": {
    "username": "alice.brown@example.com",
    "password": "QwEp3@sa"
  }
}
```
