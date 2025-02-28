import pool from "../index.js";

export const getVolunteers = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.user_id, 
        u.username,
        u.year,
        u.department, 
        u.email, 
        u.phone, 
        vp.skills, 
        vp.availability,
        t.task_id,
        t.task_name,
        t.description AS task_description,
        t.status AS task_status
      FROM Users u
      LEFT JOIN VolunteerProfiles vp ON u.user_id = vp.user_id
      LEFT JOIN Assignments a ON u.user_id = a.user_id
      LEFT JOIN Tasks t ON a.task_id = t.task_id
      WHERE u.role = 'Volunteer'
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const query = `
      UPDATE Tasks
      SET status = $1
      WHERE task_id = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [status, taskId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
