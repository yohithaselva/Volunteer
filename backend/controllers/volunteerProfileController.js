import pool from '../index.js';

export const createVolunteerProfile = async (req, res) => {
    const { user_id, skills, interests, availability } = req.body;
  
    try {
      const result = await pool.query(
        `INSERT INTO VolunteerProfiles (user_id, skills, interests, availability)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [user_id, skills, interests, availability]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error creating volunteer profile:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };

  export const getVolunteerProfileByID = async (req, res) => {
    const { user_id } = req.params; // Get user_id from route params

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM VolunteerProfiles WHERE user_id = $1`,
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Volunteer profile not found" });
        }

        // Return the profile without parsing skills/interests
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching volunteer profile:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};


 export const updateVolunteerProfile = async (req, res) => {
    const { user_id } = req.params;
    const { skills, interests, availability } = req.body;
  
    try {
      const result = await pool.query(
        `UPDATE VolunteerProfiles
         SET skills = $1, interests = $2, availability = $3
         WHERE user_id = $4
         RETURNING *`,
        [skills, interests, availability, user_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Volunteer profile not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Error updating volunteer profile:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };

  export const deleteVolunteerProfile = async (req, res) => {
    const { profile_id } = req.params;
  
    try {
      const result = await pool.query(
        `DELETE FROM VolunteerProfiles WHERE profile_id = $1
         RETURNING *`,
        [profile_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Volunteer profile not found' });
      }
  
      res.status(200).json({ message: 'Volunteer profile deleted successfully', deletedProfile: result.rows[0] });
    } catch (err) {
      console.error('Error deleting volunteer profile:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };

  export const listVolunteerProfiles = async (req, res) => {
    try {
      const result = await pool.query(`SELECT * FROM VolunteerProfiles`);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Error fetching volunteer profiles:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };

  