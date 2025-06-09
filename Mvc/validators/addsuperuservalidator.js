const { body } = require('express-validator')
module.exports=insertSuperUserValidator = [body("name").isString().withMessage('Numbers not Alawod').trim().withMessage("Can Not be White SPace ?").notEmpty().withMessage("Cant Be empty").isLength({ min: 4 }),
body("email").isString().trim().notEmpty().isEmail(),
    body("userType").isString().trim().notEmpty(),
body("password").isNumeric().trim().notEmpty(),
]