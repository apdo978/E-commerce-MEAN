const { body } = require('express-validator')


exports.insertUserValidator =[body("name").isString().withMessage('Numbers not Alawod').trim().withMessage("Can Not be White SPace ?").notEmpty().withMessage("Cant Be empty").isLength({min:4}),
                            body("email").isString().trim().notEmpty().isEmail(),
                            body("password").trim().notEmpty(),
]
exports.DeleteUserValidator=[body("email").isString().trim().isEmail(), body("password").trim()]

exports.editUserValidator = [body("email").isString().trim().isEmail(), body("password").trim(), body("newemail").isString().trim().isEmail(), body("newPAsswaord").isNumeric().trim()]
exports.loginUser = [body("email").isString().trim().notEmpty().isEmail(),
    body("password").trim().notEmpty()]
