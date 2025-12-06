const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const loginRoute = require('./routes/auth');
const shiftRoutes = require('./routes/shifts');
const shiftRoute = require('./routes/shift');
const employeeRoutes = require('./routes/employees');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/login', loginRoute);
app.use('/employees', employeeRoutes);
app.use('/users', userRoutes);
app.use('/shifts', shiftRoutes);
app.use('/shift', shiftRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

