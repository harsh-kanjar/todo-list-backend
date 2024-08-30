const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const fetchuser = require('../middleware/fetchuser');

// Route 1: Get all todos for a logged-in user
router.get('/fetchalltodos', fetchuser, async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id });
        res.json(todos);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 2: Add a new todo
router.post('/addtodo', fetchuser, async (req, res) => {
    try {
        const { todo } = req.body;
        const newTodo = new Todo({
            todo,
            user: req.user.id
        });
        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


router.put('/updatetodo/:id', fetchuser, async (req, res) => {
    console.log('Request body:', req.body);
    const { todo } = req.body;
    try {
        let todoItem = await Todo.findById(req.params.id);
        if (!todoItem) {
            return res.status(404).send("Not Found");
        }

        if (todoItem.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { $set: { todo } }, { new: true });
        res.json(updatedTodo);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).send('Not found..!');
        }

        // Validate that the user owns the todo
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).send('Not allowed');
        }

        // Delete the todo
        todo = await Todo.findByIdAndDelete(req.params.id);
        res.json({ success: "Todo has been deleted", todo: todo });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
