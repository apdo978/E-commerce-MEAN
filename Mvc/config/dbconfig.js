const mong = require('mongoose')
require('dotenv').config({path:"app.env"})

 const connectDB = async () => {
    await mong.connect(process.env.databaseurl);
    console.log("mongodb connected")
}
module.exports = connectDB