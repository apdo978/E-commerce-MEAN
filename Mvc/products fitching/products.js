require("dotenv").config({path:"../../app.env"})
const { default: mongoose } = require("mongoose")
const model =require('../models/productsmodel')
mongoose.connect(process.env.databaseurl).then(console.log("db connected")
)

const getpro = async (api) => {
    try {
        const res = await fetch(api);
        if (!res.ok) {
            console.log(res.status);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        if (error.name === "AbortError") {
            console.log("Fetch aborted");
        } else {
            console.error("Error fetching data:", error);
        }
    }
    return () => controller.abort();
};

getpro(process.env.apiLink)
    .then(async (data) => {
     data.map((ele)=>{
            ele.qunt = Math.floor(Math.random() * (200 - 100 + 1)) + 100
            console.log(ele);
            
        })
        console.log(data);
        
        await model.insertMany(data);
        console.log("data inserted");
    })
    .catch((err) => console.log({ err: err.message }));
