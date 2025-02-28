// src/routes/assignmentRoutes.js
import express from 'express';
import { createAssignment, updateAssignmentStatus, deleteAssignment, getAssignmentById,getAllAssignments } from '../controllers/assignmentController.js';

const router = express.Router();

router.post('/', createAssignment);
router.put('/:id', updateAssignmentStatus);
router.delete('/:id', deleteAssignment);
router.get('/:id', getAssignmentById);
router.get('/',getAllAssignments)


export default router;