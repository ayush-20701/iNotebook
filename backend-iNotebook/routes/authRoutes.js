const User = require('../models/user');
const router = require('express').Router()
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'ayushayushayush'
const fetchUser = require('../middleware/fetchUser')

router.post('/createuser', [ 
    // Express-validator
    body('username', 'Enter a valid username').isLength({min: 3}),
    body('password', 'Password must be at least 5 characters').isLength({min: 5}),
], async (req, res) => {
    const errors = validationResult(req)

    // If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        // Check whether the username already exists
        if(await User.findOne({username: req.body.username})) {
            return res.status(400).json({error: 'Username already exists'})
        }

        // Hash the password
        const secPass = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))

        
        // Create a new user
        await User.create({
            username: req.body.username,
            password: secPass
        }).then(user =>
            res.json(user)
        ).catch(err => {
            console.log(err.errmsg)
            res.status(500).json({error: 'Internal server error'})
        })
        
        // Create an authorization token using jsonwebtoken
        const authToken = jwt.sign({ user: { id: User.id } }, JWT_SECRET)
        // console.log("token: ",authToken);
        // res.send("User created successfully!")
    } 
    catch (error) {
        console.log(error.message);
    }
})
//authenticate user for login
router.post('/login', [
    body('username', 'Enter a valid username').isLength({min: 3}),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    const errors = validationResult(req)

    // If there are errors, return Bad request and the errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {username, password} = req.body //deconstructor
    try {
        let user = await User.findOne({username})
        if(!user) {
            return res.status(400).json({error: "Invalid credentials"})
        }
        const passComp = await bcrypt.compare(password, user.password)
        if(!passComp) {
            return res.status(400).json({error: "Invalid credentials"})
        }

        // Create an authorization token using jsonwebtoken
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({authToken})
        console.log("Login successful!");
        
    } catch (error) {
        res.send({error: error.message})
    }
})

//get user details after login
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        if(!user) {
            return res.status(404).send({error: "User not found!"})
        }
        res.send(user)
    } catch (error) {
        res.status(500).send({error: "Internal server error!"})
    }
})
module.exports = router