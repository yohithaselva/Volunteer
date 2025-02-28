import express from 'express';
import {
  createVolunteerProfile,
  getVolunteerProfileByID,
  updateVolunteerProfile,
  deleteVolunteerProfile,
  listVolunteerProfiles,
} from '../controllers/volunteerProfileController.js';

const router = express.Router();

// CRUD Routes for VolunteerProfiles
router.post('/', createVolunteerProfile); // Create
router.get('/:user_id', getVolunteerProfileByID); // Read
router.put('/:user_id', updateVolunteerProfile); // Update
router.delete('/:profile_id', deleteVolunteerProfile); // Delete
router.get('/', listVolunteerProfiles); // List All

export default router;