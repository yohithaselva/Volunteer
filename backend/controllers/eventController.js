// src/controllers/eventController.js
import pool from '../index.js';

// Create a new event
export const createEvent = async (req, res) => {
  const { event_name, description, start_date, end_date, location } = req.body;

  // Validate required fields
  if (!event_name || !start_date || !end_date) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  // Validate date format (optional)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
    return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    const result = await pool.query(
      'INSERT INTO Events (event_name, description, start_date, end_date, location) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [event_name, description, start_date, end_date, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating event:", err.message);
    res.status(500).send('Server error');
  }
};
// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Events');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { event_name, description, start_date, end_date, location } = req.body;
  try {
    const result = await pool.query(
      'UPDATE Events SET event_name = $1, description = $2, start_date = $3, end_date = $4, location = $5 WHERE event_id = $6 RETURNING *',
      [event_name, description, start_date, end_date, location, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Events WHERE event_id = $1', [id]);
    res.status(204).send('Event deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};