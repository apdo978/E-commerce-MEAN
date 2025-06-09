const productsCollection = require('../models/productsmodel')
const cartsCollection = require('../models/CartModel')
const { validationResult, body } = require('express-validator')
exports.insertProduct = async function (req, res) {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const [error] = result.array()
            return res.status(400).json({ status: "fail", data: { data: error.path + " has " + error.msg } });
        }
        console.log(req.body)
        let newProduct = await productsCollection.create(req.body)
        res.body.msg ="inserted Succfuly"
        res.status(201).json({
            status: "success", data: {
                data: res.body.msg
            }
        })
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            "message": "An error occurred",
            "code": 500,
            "data": { data: "this Product already inserted" }
        });
        console.log({ err: err.message });
    }
}
exports.getAllProducts =async (req, res) => {
    try {
        const Products = await productsCollection.find({}, { _id: false, __v: false, createdAt: false, updatedAt:false})
        res.status(200).json({
            "status": "success",
            "data": {
                "data": Products
            }
        }
)
    }
    catch (err) {
        res.status(400).json({
            status: "error",
            "message": "An error occurred",
            "code": 500,
            "data": {}
        });
        console.log({ err: err.message });
    }
}
//(neglected)exports.deleteproduct =  async function (req, res) {
//     try {
//        const result = validationResult(req)
//         if (!result.isEmpty()) {
//             const [error] = result.array()
//             return res.status(400).json({ status: "fail", data: { data: error.path + " has " + error.msg } });
//         }
//             const {email,password} = req.body
//         const DeletedUser = await Users.findOneAndDelete( { email, password})
//      DeletedUser? res.status(201).json({
//                 "status": "success",
//                 "data": {
//                     "data": `User Has Been ${DeletedUser.email} Deleted Succfully `
//                 }
//             }
//      ) : res.status(400).json( {
//             "status": "fail",
//             "data": {
//                 "data": "User has been deleted or not found"
//             }
//         })

//     }

//     catch (err) {
//         res.status(400).json({
//             status: "error",
//             "message": "An error occurred",
//             "code": 500,
//             "data": {}
//         });
//         console.log({ err: err.message });
//     }
// }
exports.UsersCart = async (req, res,next) => {//new functionalty added
    try{
    const result = validationResult(req)
    if (!result.isEmpty()) {
        const [error] = result.array()
        return res.status(400).json({ status: "fail", data: { data: error.path + " has " + error.msg } });
    }
    const { name, email } = req.user//name , email 
    let flag = 1
        order = { name, email, products: req.body, isOrder: true } 
        let ids = []
           for (let i = 0; i < req.body.length; i++) {
               let datbal = await productsCollection.updateOne({ id: req.body[i].id, avilable:true, $expr: { $gte: ["$qunt", req.body[i].total || 0] } }, { $inc: { qunt :-req.body[i].total||0}})
               if (datbal.modifiedCount == 0 && datbal.matchedCount == 0){
                   await productsCollection.updateOne({ $and: [{ id: req.body[i].id }, { avilable: true }] }, { avilable: false })
                flag = 0
               }
            
           }
        
        // Check for existing cart and mark it as an order
        const existingCart = await cartsCollection.findOne({ name, email, isOrder: false });
        if (existingCart) {
            existingCart.isOrder = true;
            await existingCart.save();
        }
        
        // Create a new order
        let newCart = await cartsCollection.create(order)
       
        if(flag == 1){
        res.status(201).json({
            status: "success", data: {
                data: res.msg || "",
            }
        })
        } else {
            res.status(500).json({
                status: "error",
                "message": "An error occurred",
                "code": 500,
                "data": { data: "this Product not found now " }
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "error",
            "message": "An error occurred",
            "code": 500,
            "data": { data: err.message }
        });
    }
}