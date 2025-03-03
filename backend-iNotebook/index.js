const express = require('express');
const app = express();
const port = 5000
const connectToMongo = require('./db');
app.use(express.json())

connectToMongo();
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/notes', require('./routes/notesRoutes'))
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})