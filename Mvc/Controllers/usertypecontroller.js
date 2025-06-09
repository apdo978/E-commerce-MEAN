const Users = require('../models/usermodel');
const UsersTypess = require('../models/usertype')
const express = require('express')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: "../app.env" })
const secret_key = process.env.secretkey
const encrypt = require('bcryptjs')

const insertSuperUser =async function (req, res) {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const [error] = result.array()
            return res.status(400).json({ status: "fail", data: { data: error.path + " " + error.msg } });
        }
            const newUser = await UsersTypess.find({ _id: req.body.userType })
            if (newUser.length !== 0) { } else { return res.status(404).json({ status: "fail", data: { data: "invalid Type Token" } }) }
                     const {  password } = req.body;
                    req.body.password = await encrypt.hash(password, 10)
                    const User = await Users.create(req.body)
        if (User.length !== 0){
                    res.status(201).json({
                        status: "success", data: {
                            data: `New User Has Been Created Succfully ${newUser.name}`
                        }
                    })} else {
            res.status(500).json({
                status: "error",
                "message": "An error occurred",
                "code": 500,
                "data": { data: err.message }
            });
}
        // else { res.status(404).json({ status: "fail", data: { data: "not User Type Token" } }) }
    }
    catch (err) {
        res.status(500).json({
            status: "error",
            "message": "An error occurred",
            "code": 500,
            "data": { data: err.message }
        });
        console.log({ err: err.message });
    }
}
module.exports = insertSuperUser
// insertSuperUserValidator