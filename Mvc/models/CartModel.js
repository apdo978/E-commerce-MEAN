const mong = require('mongoose')
const CartSchema = mong.Schema({
    name: String,
    email: String,
    products: Array,
    isOrder: {
        type: Boolean,
        default: false,
        
    }
}, { timestamps: true })
module.exports = mong.model('Cart', CartSchema)
