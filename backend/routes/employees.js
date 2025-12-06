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

// GET /employees/:id (get specific employee by ID)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const data = await readData();
    const employees = data.employees || [];
    const employeeId = parseInt(req.params.id);
    
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /employees (with optional query params: name, employee_code)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const data = await readData();
    let employees = data.employees || [];

    // Apply query filters if provided
    const { name, employee_code } = req.query;

    if (name) {
      employees = employees.filter(emp => 
        emp.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (employee_code) {
      employees = employees.filter(emp => 
        emp.employee_code.toLowerCase() === employee_code.toLowerCase()
      );
    }

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /employees - Creates employee AND user account together (all required)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, employee_code, department, email, password, role = 'user' } = req.body;

    // Validation - ALL fields are required
    if (!name || !employee_code || !department || !email || !password) {
      return res.status(400).json({ 
        error: 'name, employee_code, department, email, and password are all required' 
      });
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

    // Only admins can create employees
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create employees' });
    }

    // Read existing data
    const data = await readData();

    // Initialize arrays if they don't exist
    if (!data.employees) {
      data.employees = [];
    }
    if (!data.users) {
      data.users = [];
    }

    // Check if employee code already exists
    const existingEmployee = data.employees.find(
      emp => emp.employee_code === employee_code
    );

    if (existingEmployee) {
      return res.status(400).json({ 
        error: 'Employee code already exists' 
      });
    }

    // Check if email already exists
    const existingEmail = data.users.find(u => u.email === email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new employee ID
    const newEmployeeId = data.employees.length > 0 
      ? Math.max(...data.employees.map(e => e.id)) + 1 
      : 1;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user ID
    const newUserId = data.users.length > 0 
      ? Math.max(...data.users.map(u => u.id)) + 1 
      : 1;

    // Create new employee (linked to user)
    const newEmployee = {
      id: newEmployeeId,
      name: name.trim(),
      employee_code: employee_code.trim(),
      department: department.trim(),
      user_id: newUserId
    };

    // Create new user (linked to employee)
    const newUser = {
      id: newUserId,
      email: email.trim(),
      password: hashedPassword,
      role: role,
      employee_id: newEmployeeId
    };

    // Save both
    data.employees.push(newEmployee);
    data.users.push(newUser);
    await writeData(data);

    // Return employee and account info with plain password for sharing
    res.status(201).json({
      employee: {
        id: newEmployee.id,
        name: newEmployee.name,
        employee_code: newEmployee.employee_code,
        department: newEmployee.department,
        user_id: newEmployee.user_id
      },
      account: {
        email: newUser.email,
        password: password, // Return plain password for admin to share
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
