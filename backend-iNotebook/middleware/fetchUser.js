const jwt = require('jsonwebtoken')
const JWT_SECRET = 'ayushayushayush'

const fetchUser = (req, res, next) => {
    //get user from jwt token and add id to req object
    const token = req.header('auth-token')
    if(!token) {
        return res.status(401).json({ error: "Access Denied! No token provided" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        return res.status(401).json({ error: "Invalid token!" })
    }
}
module.exports = fetchUser