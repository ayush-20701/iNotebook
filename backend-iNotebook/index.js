const express = require('express');
const app = express();
const port = 3000
const connectToMongo = require('./db');
connectToMongo();
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
app.get('/', (req, res) => {
    res.send('Hello World!')
})