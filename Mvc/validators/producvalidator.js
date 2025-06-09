const {body} =require('express-validator');
exports.insertproductsvalidator = [body('id').trim().notEmpty().isNumeric().isLength(1).withMessage("invalid id")
   , body('title').trim().notEmpty().isString().isLength({ min: 4 }).withMessage("invalid id"),
   body('price').trim().notEmpty().isNumeric().withMessage("invalid id"),
                        body('category').trim().notEmpty().isString(),
                        body('desc').trim().isString(),
   body('imageUrl').trim().notEmpty().isURL().withMessage("invalid URL"),
                        ]

exports.editproductsvalidator =[body('name').trim().notEmpty().isString().isLength({min:4}),
                                body('id').trim().notEmpty().isString(),
]
exports.deleteproductsvalidator =[body('name').trim().notEmpty().isString().isLength({min:4}),
                                body('id').trim().notEmpty().isString(),
]
exports.Cartsvalidator = [

]