const express = require('express')
const Users = require('../models/usermodel');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: "../app.env" })
const secret_key = process.env.JWT_SECRET
const UsersTypess = require('../models/usertype');
const encrypt = require('bcryptjs');
const usertype = require('../models/usertype');

 const insertUser =async function (req, res,next) {
    
            const result = validationResult(req)
            if (!result.isEmpty()) {
                const [error] = result.array()
                return res.status(400).json({ status: "fail", data: { data: error.path +" "+error.msg } });
            }
        // if (req.body.userType){
        //     const newUser = await UsersTypess.find({ _id: req.body.userType })
        //         if (newUser.length !== 0) {} else {return res.status(404).json({ status: "fail", data: { data: "not User Type Token"} })}            
        const {  password } = req.body;
        req.body.password = await encrypt.hash(password, 10)
           const  newUser = await Users.create(req.body)
        res.status(201).json({
            status: "success", data: {
                data: `New User Has Been Created Succfully ${newUser.name}` } })
        
   
}


const getAllUsers =async (req, res) => {
    try {
        const users = await Users.find({}, { _id: false, __v: false, createdAt: false, updatedAt: false }).populate('name')
        res.status(200).json({
            "status": "success",
            "data": {
                "data": users
            }
        }
)
    }
    catch (err) {
        res.status(400).json({
            status: "error",
            "message":err.message,
            "code": 500,
            "data": {}
        });
    
    }
}

const DeleteUsers = async function (req, res) {
    try {
       const result = validationResult(req)
        if (!result.isEmpty()) {
            const [error] = result.array()
            return res.status(400).json({ status: "fail", data: { data: error.path + " has " + error.msg } });
        }
            const {email,password} = req.body
            const Userchk = await Users.findOne({email})
            if (Userchk){
                  const hashchk =  await encrypt.compare(password, Userchk.password)
                if (hashchk){
        const DeletedUser = await Users.findOneAndDelete({ email, password:Userchk.password })
        res.status(201).json({
                        "status": "success",
                                    "data": {
                                            "data": `User Has Been ${DeletedUser.email} Deleted Succfully `
                                        }
        })
                } else {
                    res.status(400).json({

                        "status": "fail",
                        "data": {
                            "data": "User has been deleted or not found"
                        }
                    })
}
            } else {
                res.status(400).json({

                    "status": "fail",
                    "data": {
                        "data": "User has been deleted or not found"
                    }
                })
}
}

    catch (err) {
        res.status(400).json({
            status: "error",
            "message": err.message,
            "code": 500,
            "data": {}
        });
   
    }
}
const EditUsers = async function (req, res) {
    try {
       const result = validationResult(req)
        if (!result.isEmpty()) {
            const [error] = result.array()
            return res.status(400).json({ status: "fail", data: { data: error.path + " has " + error.msg } });
        }
            const {email,password,newemail,newPAsswaord} = req.body
            if(email === newemail && password === newPAsswaord){
                return res.status(400).json({
                    "status": "fail",
                    "data": {
                        "field": "email or password are thesame"
                    }
                })
            }
            const Userchk = await Users.findOne({ email })
            
            if (Userchk) {
                const hashchk = await encrypt.compare(password, Userchk.password)
                if (hashchk) {
                    const newHashedPassword = await encrypt.hash(newPAsswaord, 10)
                    const UpdateUser = await Users.findOneAndUpdate({ email }, { email: newemail, password: newHashedPassword })
                 res.status(202).json({
                    "status": "success",
                    "data": {
                        "data": `User ${UpdateUser.email} Has Been Updated Succfully to ${newemail}`
                    }
                })
                } else {

                    res.status(400).json({
                        "status": "fail",
                        "data": {
                            "field": "email not found or password isincorrect"
                        }
                    })
                }
        } else {
         
            res.status(400).json({
               "status": "fail",
               "data": {
                   "field": "email not found or password isincorrect"
               }
           })
        }
      
    }

    catch (err) {
        res.status(500).json({
            status: "error",
            "message": err.message,
            "code": 500,
            "data": {}
        });
       
    }
}
const loginUser = async (req,res)=>{
    try{
        const userData = validationResult(req)
        if (!userData.isEmpty()) {
            const [error] = userData.array()
            return res.status(400).json({ status: "fail", data: { data: error.path + " has " + error.msg } });
        }
        const { email, password } = req.body

        
        let Userchk = await Users.findOne({ email }, {})
        if (Userchk) {
            const hashchk =  await encrypt.compare(password, Userchk.password)
            if (hashchk) {
               const  { name, email, userType }= Userchk
                dbChek = { name, email, userType }
    res.json({
            status: "success1",
            
                data: { data: jwt.sign(dbChek, secret_key) } }) 
    }else{
        res.status(400).json({
            "status": "fail",
            "data": {
                "field": "email not found or password isincorrect"
            }
        })}
        } else {
            res.status(500).json({
                "status": "fail",
                "data": {
                    "field": "Email not Found" 
                }
            })
}
}
catch (err) {
        res.status(500).json({
            "status": "fail",
            "data": {
                "field": "sOmthing went wrong"
            }
        })
     }
}
const verify = (req, res,next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(403).send('Token is required');
    }

    // Handle Bearer token format
    let tokenValue = token;
    if (token.startsWith('Bearer ')) {
        tokenValue = token.slice(7);
    }

    jwt.verify(tokenValue, secret_key, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        req.user = decoded; 
        
        next();
    });
}
const isAdmin = async (req,res,next)=>{

    
    if (req.user!=undefined){
        
        try{
            
            if (req.body.ObjectId !== undefined || req.query.ObjectId !== null){
               
                obj = req.body.ObjectId || req.query.ObjectId
                const dbChek = await UsersTypess.find({ _id: obj })
                if (dbChek.length !== 0) {next() }
        else {
            return res.status(404).json({
                "status": "fail",
                "data": {
                    "field": "Not Authenticated"
                }
            })
        }
}
            else {
                return res.status(404).json({
                    "status": "fail",
                    "data": {
                        "field": "obj id invalid"
                    }
                })
            }
}
        catch (err) {
            res.status(400).json({
                "status": "fail",
                "data": {
                    "field": "Not Authenticated"
                }
            })
        }

        }

else{
            return res.status(400).json({
                "status": "fail",
                "data": {
                    "field": "Not Authenticated"
                }
            })}

    
}//require jwt verify
const updateProfile = async (req, res) => {
    try {
        const { name: newName, email: newEmail , newPassword: newPassword, password: password } = req.body;
        
        // Get user from token
        let { name,email  } = req.user;


        // Find user by email (unique identifier)
        const user = await Users.findOne({ email, name });
        if (!user) {
            return res.status(404).json({
                status: "fail",
                data: { message: "User not found" }
            });
        }
        else if(
            name == newName && email == newEmail && newPassword == password ||
            name == newName && email == newEmail && newPassword ==''
        ){
            return res.status(400).json({
                status: "fail",
                data: { message: "Same Inputs" }
            });
        }

        // If password is provided, verify it
        if (password) {
        
            const isValidPassword = await encrypt.compare(password, user.password);
            
            if (!isValidPassword) {
                return res.status(400).json({
                    status: "fail",
                    data: { message: "Current password is incorrect" }
                });
            }
        }
        

        // Update user data
        let updates = {};
        if (newName) updates.name = newName;
        if (newEmail) updates.email = newEmail;
        if (newPassword) {
            updates.password = await encrypt.hash(newPassword, 10);
        }
    ;

        // Update user
        const updatedUser = await Users.findByIdAndUpdate(
            user._id,
            { $set: updates },
            { new: true, select: '-password' }
        );
         name  = updatedUser.name;
        email = updatedUser.email;
        const iat = req.user.iat       
        // Create new JWT token with updated user data

       newToken = jwt.sign({ name, email, iat }, secret_key)

     

        return res.status(200).json({
            status: "success",
            data: {
                user: { name, email },
                token: newToken
            }
        });

    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};

module.exports = { insertUser, getAllUsers, EditUsers, loginUser, verify, isAdmin, updateProfile}
/*{
            status: "success", data: {
                data: `New User Has Been Created Succfully ${newUser.name}` } } */