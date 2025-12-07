import express from "express";
import { getProfile, updateProfile, addSkillOffered, removeSkillOffered, addSkillWanted, updateAvailability } from "../controllers/profile.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/:id', getProfile);
router.put('/', protect, updateProfile);
router.post('/skills/offered', protect, addSkillOffered);
router.delete('/skills/offered/:skillId', protect, removeSkillOffered);
router.post('/skills/wanted', protect, addSkillWanted);
router.put('/availability', protect, updateAvailability);

export default router;