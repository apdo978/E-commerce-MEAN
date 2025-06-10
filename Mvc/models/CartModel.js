const mong = require('mongoose')
const CartSchema = mong.Schema({
    id: {
        type: Number,
        required: true,
        
    },
    name: String,
    email: String,
    products: Array,
    isOrder: {
        type: Boolean,
        default: false,
        
    },
    status:{
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    }
}, { timestamps: true })
module.exports = mong.model('Cart', CartSchema)
