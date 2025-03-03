const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const { Schema } = mongoose;
const fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/notes');
const {body, validationResult} = require('express-validator')

//Get all notes
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        console.log("Fetching notes for user ID:", req.user.id);
        const notes = await Notes.find({user: req.user.id})
        res.json(notes)
    } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
    }
})

//Add a new note
router.post('/addnote', fetchUser, [
    body('title', 'Title must be at least 3 characters!').isLength({min: 3}),
    body('description', 'Description must be at least 10 characters!').isLength({min: 10})
], async (req, res) => {
    try {
        const {title, description, tag} = req.body
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }
        const note = new Notes({
            title, 
            description, 
            tag, 
            user: req.user.id
        })
        await note.save()
        res.json(note)

    } catch (error) {
        res.send({error: error})
    }

})

//Update an existing note
router.post('/updatenote', fetchUser, (req, res) => {
    
})

module.exports = router