const express = require('express');
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

// Helper function to parse time string (HH:mm) to minutes
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to check if two time ranges overlap
const isOverlapping = (start1, end1, start2, end2) => {
  const start1Min = timeToMinutes(start1);
  const end1Min = timeToMinutes(end1);
  const start2Min = timeToMinutes(start2);
  const end2Min = timeToMinutes(end2);

  return (start1Min < end2Min && end1Min > start2Min);
};

// Helper function to calculate shift duration in hours
const calculateDuration = (startTime, endTime) => {
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  
  // Handle overnight shifts
  let duration = (endMin - startMin) / 60;
  if (duration < 0) {
    duration += 24;
  }
  
  return duration;
};

// GET /shifts?employee=xx&date=xx
router.get('/', authenticateToken, async (req, res) => {
  try {
    const data = await readData();
    let shifts = data.shifts || [];

    // Get user's employee_id if they have one
    const user = data.users.find(u => u.id === req.user.userId);
    const userEmployeeId = user ? user.employee_id : null;

    // If user is not admin, filter to show only their shifts
    if (req.user.role !== 'admin') {
      if (userEmployeeId) {
        shifts = shifts.filter(shift => shift.employee_id === userEmployeeId);
      } else {
        shifts = [];
      }
    }

    // Apply query filters
    const { employee, date } = req.query;
    
    if (employee) {
      shifts = shifts.filter(shift => shift.employee_id === parseInt(employee));
    }
    
    if (date) {
      shifts = shifts.filter(shift => shift.date === date);
    }

    res.json(shifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /shifts
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { employee_id, date, start_time, end_time } = req.body;

    // Validation
    if (!employee_id || !date || !start_time || !end_time) {
      return res.status(400).json({ 
        error: 'employee_id, date, start_time, and end_time are required' 
      });
    }

    // Only admins can create shifts
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create shifts' });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ error: 'Date must be in YYYY-MM-DD format' });
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return res.status(400).json({ error: 'Time must be in HH:mm format' });
    }

    // Calculate shift duration
    const duration = calculateDuration(start_time, end_time);

    // Business Rule 1: Shift must be minimum 4 hours
    if (duration < 4) {
      return res.status(400).json({ 
        error: 'Shift must be at least 4 hours long' 
      });
    }

    // Read existing data
    const data = await readData();

    // Check if employee exists in employees table
    const employee = data.employees.find(e => e.id === parseInt(employee_id));
    if (!employee) {
      return res.status(400).json({ error: 'Employee not found' });
    }

    // Business Rule 2: No overlapping shifts for the same employee on the same date
    const existingShifts = (data.shifts || []).filter(
      shift => shift.employee_id === parseInt(employee_id) && shift.date === date
    );

    for (const existingShift of existingShifts) {
      if (isOverlapping(start_time, end_time, existingShift.start_time, existingShift.end_time)) {
        return res.status(400).json({ 
          error: 'Shift overlaps with an existing shift for this employee on the same date' 
        });
      }
    }

    // Create new shift
    const newShift = {
      id: data.shifts.length > 0 
        ? Math.max(...data.shifts.map(s => s.id)) + 1 
        : 1,
      employee_id: parseInt(employee_id),
      date,
      start_time,
      end_time,
      duration: duration.toFixed(2),
      created_at: new Date().toISOString()
    };

    data.shifts.push(newShift);
    await writeData(data);

    res.status(201).json(newShift);
  } catch (error) {
    console.error('Error creating shift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
