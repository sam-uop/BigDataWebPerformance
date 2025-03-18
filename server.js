const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB (Using Compass connection string)
mongoose.connect('mongodb://127.0.0.1:27017/todo-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Task Schema & Model
const taskSchema = new mongoose.Schema({
    text: String,
    order: Number, // To maintain the task order
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// Add Task (without explicitly setting _id)
app.post('/tasks', async (req, res) => {
    const { text } = req.body;

    // Get the last order value and increment it
    const lastTask = await Task.findOne().sort({ order: -1 });
    const newOrder = lastTask ? lastTask.order + 1 : 1;

    const newTask = new Task({ text, order: newOrder });
    await newTask.save();

    res.json(newTask);
});

// Get All Tasks (Sort by order)
app.get('/tasks', async (req, res) => {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 50;

    const tasks = await Task.find()
        .sort({ order: 1 })
        .skip(start)
        .limit(limit);

    res.json(tasks);
});

// Delete Task
app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
});

// Update Task
app.put('/tasks/:id', async (req, res) => {
    const { text } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { text }, { new: true });
    res.json(updatedTask);
});

// Reorder Tasks (Swap task order)
app.put('/tasks/reorder', async (req, res) => {
    const { sourceIndex, destinationIndex } = req.body;

    const tasks = await Task.find().sort({ order: 1 });

    if (
        sourceIndex < 0 || 
        destinationIndex < 0 || 
        sourceIndex >= tasks.length || 
        destinationIndex >= tasks.length
    ) {
        return res.status(400).json({ error: 'Invalid index' });
    }

    // Swap order values
    const temp = tasks[sourceIndex].order;
    tasks[sourceIndex].order = tasks[destinationIndex].order;
    tasks[destinationIndex].order = temp;

    await tasks[sourceIndex].save();
    await tasks[destinationIndex].save();

    res.json(await Task.find().sort({ order: 1 }));
});

const PORT = 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
