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

// DELETE /shift/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const shiftId = parseInt(req.params.id);

    // Only admins can delete shifts
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete shifts' });
    }

    const data = await readData();
    const shiftIndex = data.shifts.findIndex(s => s.id === shiftId);

    if (shiftIndex === -1) {
      return res.status(404).json({ error: 'Shift not found' });
    }

    data.shifts.splice(shiftIndex, 1);
    await writeData(data);

    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

