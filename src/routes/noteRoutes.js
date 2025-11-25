import express from "express";
import { createNote, getNote, deleteNote, updateNote } from "../controllers/noteControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", protect, createNote);       // Create a note
router.get("/", protect, getNote);           // Get user notes
router.delete("/:id", protect, deleteNote);  // Delete note (only owner)
router.put("/:id", protect, updateNote);     // Update note (only owner)

export default router;
