import Note from "../models/noteModel.js";

// @desc    Create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const newNote = await Note.create({
      user: req.user._id,
      title,
      content,
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
};

// @desc    Get logged-in user’s notes
export const getNote = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
};

// @desc    Delete note (only if owner)
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

    if (!note) return res.status(404).json({ message: "Note not found or unauthorized" });

    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
};

// @desc    Update note (only if owner)
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title: req.body.title, content: req.body.content },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
};
