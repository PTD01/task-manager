const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");
const router = express.Router();

// Auth middleware
function auth(req, res, next) {
  const token = req.header("Authorization");
  console.log("JWT_SECRET:", process.env.JWT_SECRET); // ✅ Debug line
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(400).send("Invalid Token");
  }
}

// Get all tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Add task
router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;
  const newTask = new Task({ title, description, userId: req.user.id });
  await newTask.save();
  res.status(201).json(newTask);
});

// Update task
router.put("/:id", auth, async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedTask);
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Task deleted");
});

// Get task stats
router.get("/stats", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({
      userId,
      completed: true,
    });

    res.json({ totalTasks, completedTasks });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
});

module.exports = router;
