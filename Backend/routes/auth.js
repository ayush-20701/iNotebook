const express = require('express')
const User = require('../models/User')
const router = express.Router() // This is a router object that has the same methods as the app object
const { query, validationResult } = require('express-validator');

router.post('/', (req, res) => {
    const user = User(req.body) // This will create a new user object
    user.save() // This will save the user to the database
    console.log(req.body);
    
    res.send(req.body)
})
module.exports = router