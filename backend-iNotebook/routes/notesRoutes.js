const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
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
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    // try {
        const {title, description, tag} = req.body
        //create a new note object
        const newNote = {}
        if(title){newNote.title = title}
        if(description){newNote.description = description}
        if(tag){newNote.tag = tag}
    
        //find the note to be updated
        let note = await Notes.findById(req.params.id)
        console.log(note);
        
        if(!note) {
            return res.status(404).send("Not found!")
        }
        console.log("user:",req.user);
        
        //Allow update only if user owns this note
        if(!note.user || note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!")
        }
        //update
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note})
    // } catch (error) {
    //     res.send({error: error})
    // }
})

//Delete an existing note
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        //find the note to be deleted
        var note = await Notes.findById(req.params.id)
        if(!note) {
            return res.status(404).send("Not found!")
        }
    
        //Allow delete only if user owns this note
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed!")
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({
            "Success": "note has been deleted!",
            "note": note
        })
    } catch (error) {
        res.send("Internal server error!")
    }
})

module.exports = router