const express = require('express')
const routes = express.Router()
const avatarupload = require('../Controllers/multers').avatarupload
const { 
    insertUser, 
    getAllUsers, 
    EditUsers, 
    loginUser, 
    verify, 
    isAdmin,
    updateProfile,
    uploadavatar,
    getAvatar,
    getUserAvatar,
    deleteAvatar
} = require('../Controllers/usercontroller')
const userValidatore = require('../validators/uservalidator')
const asyncwrapper = require('../utilis/asyncwrapper')
// Crud USER
//1-Create User
//{message:"pls insert aname"}
routes.post("/login", userValidatore.loginUser, asyncwrapper(loginUser))

routes.post("/InsertUserS", userValidatore.insertUserValidator, asyncwrapper(insertUser))

//2-get all  Users
routes.get("/GetAllUserS", verify, isAdmin, getAllUsers)

routes.post("/avatar", verify, avatarupload.single('avatar'), asyncwrapper(uploadavatar));

// Get current user's avatar
routes.get("/avatar", verify, asyncwrapper(getAvatar));

// Delete current user's avatar
routes.delete("/avatar", verify, asyncwrapper(deleteAvatar));

// Get any user's avatar by user ID (public route)
routes.get("/avatar/:userId", asyncwrapper(getUserAvatar));

// routes.delete("/DeleteUsers", verify,userValidatore.DeleteUserValidator,DeleteUsers)
  //  in the next commit i will make a new model for user contains a flag(avilable : true or false) delete will detect if usuers has active order
//or not and can cancel users order and retrive db products balance 

routes.patch("/EditUsers", verify, isAdmin, userValidatore.editUserValidator, EditUsers)

// Update user profile (protected route)
routes.patch("/profile", 
    verify, 
  userValidatore.editUserValidator, 
    asyncwrapper(updateProfile)
);

module.exports = routes