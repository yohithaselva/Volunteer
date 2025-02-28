import pool from '../index.js';
import nodemailer from 'nodemailer';

// Send Notification and Email to Volunteer
export const sendNotification = async (req, res) => {
  const { user_id, message, status = 'Sent' } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: 'User ID and Message are required' });
  }

  try {
    // Fetch volunteer's email from the database
    const userResult = await pool.query('SELECT email FROM Users WHERE user_id = $1', [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const volunteerEmail = userResult.rows[0].email;

    // Insert notification into the database
    const result = await pool.query(
      'INSERT INTO Notifications (user_id, message, sent_at, status) VALUES ($1, $2, NOW(), $3) RETURNING *',
      [user_id, message, status]
    );

    const notification = result.rows[0];

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password' // Replace with your email password (Use environment variables)
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: volunteerEmail,
      subject: 'New Notification from Admin',
      text: `Hello, you have a new notification:\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ message: 'Notification sent successfully', notification });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Notifications WHERE user_id = $1', [user_id]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE Notifications SET status = $1 WHERE notification_id = $2 RETURNING *',
      ['Read', id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

