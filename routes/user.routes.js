import express from 'express';
import { createUser, getAllUsers, getUserByEmail } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/create', createUser);
router.get('/all', getAllUsers);
router.get('/:email', getUserByEmail);

export default router;