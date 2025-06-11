const express = require('express');
const routes = express.Router()
const { insertProduct, getAllProducts, UsersCart, updateOrderStatus } =require('../Controllers/productcontroller.js')
const { isAdmin } =require('../Controllers/usercontroller.js')
const cartsCollection = require('../models/CartModel')
const productsvalidator = require('../validators/producvalidator.js');
const { verify } = require('../Controllers/usercontroller.js');
const asyncwrapper = require('../utilis/asyncwrapper.js');


routes.get('/getAllProducts', /*verify,/*isAdmin,*/ asyncwrapper(getAllProducts))
routes.post('/insertProduct', verify, isAdmin, productsvalidator.insertproductsvalidator, asyncwrapper(insertProduct))
// routes.delete('/deleteProduct',productsvalidator.deleteproductsvalidator, deleteProduct)
routes.post('/order', verify, productsvalidator.Cartsvalidator,asyncwrapper(UsersCart))
routes.patch('/order/:orderId', verify, asyncwrapper(updateOrderStatus))

routes.get('/lastOrders', verify,asyncwrapper(async (req,res)=>{
    try{
        if (typeof req.user == "string") {
            
            const nameMatch = req.user.match(/name:\s*'([^']+)'/);
            const emailMatch = req.user.match(/email:\s*'([^']+)'/);
    
            const name = nameMatch ? nameMatch[1] : 'Name not found';
            const email = emailMatch ? emailMatch[1] : 'Email not found';
            const orders =await  cartsCollection.find({name,email},{_id:false})
            res.json({data:orders})
        }else{
            const {name,email} = req.user
            let orders = await cartsCollection.find({ name,email })
            res.json(orders )

        }
        }
    catch(err){
        res.status(500).json({
            status: "error",
            "message": "An error occurred",
            "code": 500,
            "data": { data: err.message }
        });
    }
}))
module.exports = routes





