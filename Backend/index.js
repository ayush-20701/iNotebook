const express = require('express')
const connectToMongo = require('./db')
const app = express()
const port = 3000

app.use(express.json()) // This is a middleware that allows us to parse JSON data from the client


app.listen(port , () => {
    console.log(`Server is running on port ${port}`)
})
app.use('/api/auth', require('./routes/auth'))

connectToMongo()