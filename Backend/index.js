const express = require('express')
const connectToMongo = require('./db')
const app = express()
const port = 3000
app.listen(port , () => {
    console.log(`Server is running on port ${port}`)
})
app.get('/', (req, res) => {    
    res.send('Hello World!')
})
connectToMongo()