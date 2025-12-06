const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to read data.json
const readData = async () => {
  const dataPath = path.join(__dirname, '../data.json');
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data.json
const writeData = async (data) => {
  const dataPath = path.join(__dirname, '../data.json');
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

// POST /users - Create user account for an employee (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { employee_id, email, password, role = 'user' } = req.body;

    // Validation
    if (!employee_id || !email || !password) {
      return res.status(400).json({ 
        error: 'employee_id, email, and password are required' 
      });
    }

    // Only admins can create user accounts
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create user accounts' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either "admin" or "user"' });
    }

    // Read existing data
    const data = await readData();

    // Check if employee exists
    const employee = data.employees.find(e => e.id === parseInt(employee_id));
    if (!employee) {
      return res.status(400).json({ error: 'Employee not found' });
    }

    // Check if employee already has a user account
    if (employee.user_id !== null) {
      const existingUser = data.users.find(u => u.id === employee.user_id);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'This employee already has a user account' 
        });
      }
    }

    // Check if email already exists
    const existingEmail = data.users.find(u => u.email === email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: data.users.length > 0 
        ? Math.max(...data.users.map(u => u.id)) + 1 
        : 1,
      email: email.trim(),
      password: hashedPassword,
      role: role,
      employee_id: parseInt(employee_id)
    };

    // Update employee to link to user
    employee.user_id = newUser.id;

    data.users.push(newUser);
    await writeData(data);

    res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        employee_id: newUser.employee_id
      },
      employee: {
        id: employee.id,
        name: employee.name,
        employee_code: employee.employee_code
      }
    });
  } catch (error) {
    console.error('Error creating user account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

