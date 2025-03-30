const mongoose = require('mongoose');
const mongoURL = 'mongodb+srv://mypc21907:RGKh4ROkrAeY6zZC@inotebook.uicakhy.mongodb.net/?retryWrites=true&w=majority&appName=iNotebook'
const connectToMongo = async () => {
    await mongoose.connect(mongoURL)
    console.log('Connected to Mongo successfully')
}
module.exports = connectToMongo