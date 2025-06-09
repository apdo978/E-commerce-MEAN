const express = require('express')
const routs = express.Router()
const userTypesCotroller =require('../Controllers/usertypecontroller')
const superValid = require('../validators/addsuperuservalidator')
const { verify } = require('../Controllers/usercontroller')

routs.post("/",verify,superValid, userTypesCotroller)
module.exports = routs