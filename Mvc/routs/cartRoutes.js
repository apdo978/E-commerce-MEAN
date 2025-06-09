const express = require('express');
const router = express.Router();
const { verify } = require('../Controllers/usercontroller.js');
const asyncwrapper = require('../utilis/asyncwrapper.js');
const cartsCollection = require('../models/CartModel');
const productsCollection = require('../models/productsmodel');

// Get cart items for the logged-in user
router.get('/', verify, asyncwrapper(async (req, res) => {
    try {
        let name, email;

        if (typeof req.user === 'string') {
            const nameMatch = req.user.match(/name:\s*'([^']+)'/);
            const emailMatch = req.user.match(/email:\s*'([^']+)'/);
            name = nameMatch ? nameMatch[1] : 'Name not found';
            email = emailMatch ? emailMatch[1] : 'Email not found';
        } else {
            ({ name, email } = req.user);
        }

        // Find the latest cart for this user that hasn't been converted to an order
        const cart = await cartsCollection.findOne({ 
            name, 
            email, 
            isOrder: false 
        }, { _id: false }).sort({ createdAt: -1 });


        if (!cart) {
            return res.status(200).json({
                status: "success",
                data: {
                    data: []
                }
            });
        }

        return res.status(200).json({
            status: "success",
            data: {
                data: cart.products
            }
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occurred",
            code: 500,
            data: { data: err.message }
        });
    }
}));

// Add product to cart
router.post('/', verify, asyncwrapper(async (req, res) => {
    try {
        let name, email;
        
        if (typeof req.user === 'string') {
            const nameMatch = req.user.match(/name:\s*'([^']+)'/);
            const emailMatch = req.user.match(/email:\s*'([^']+)'/);

            name = nameMatch ? nameMatch[1] : 'Name not found';
            email = emailMatch ? emailMatch[1] : 'Email not found';
        } else {
            ({ name, email } = req.user);
        }

        const { productId, quantity } = req.body;
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                status: "fail",
                data: { data: "Invalid product or quantity" }
            });
        }

        // Find the product
        const product = await productsCollection.findOne({ id: productId });
        if (!product) {
            return res.status(404).json({
                status: "fail",
                data: { data: "Product not found" }
            });
        }

        // Check stock availability (assuming product has a stock field)
        if (product.stock < quantity) {
            return res.status(400).json({
                status: "fail",
                data: { data: "Requested quantity exceeds available stock" }
            });
        }

        // Find or create cart
        let cart = await cartsCollection.findOne({ name, email, isOrder: false });

        if (!cart) {
            const products = [{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: quantity
            }];
            
            cart = await cartsCollection.create({
                name,
                email,
                products: products,
                isOrder: false
            });
        } else {
            // Check if product already in cart
            const existingProductIndex = cart.products.findIndex(p => p.id === productId);
            
            if (existingProductIndex >= 0) {
                // Update quantity if product exists
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Add new product to cart
                cart.products.push({
                    id: productId,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }
            // Update cart using save() instead of findOneAndUpdate
            cart.markModified('products');
            await cart.save();
        }

        // Send success response with updated cart
        return res.status(200).json({
            status: "success",
            data: {
                data: cart.products
            }
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occurred",
            code: 500,
            data: { data: err.message }
        });
    }
}));

// Remove product from cart
router.delete('/:productId', verify, asyncwrapper(async (req, res) => {
    try {
        let name, email;
        if (typeof req.user === 'string') {
            const nameMatch = req.user.match(/name:\s*'([^']+)'/);
            const emailMatch = req.user.match(/email:\s*'([^']+)'/);
            name = nameMatch ? nameMatch[1] : 'Name not found';
            email = emailMatch ? emailMatch[1] : 'Email not found';
        } else {
            ({ name, email } = req.user);
        }

        const { productId } = req.params;

        // Find the cart
        const cart = await cartsCollection.findOne({ name, email, isOrder: false });
        if (!cart) {
            return res.status(404).json({
                status: "fail",
                data: { data: "Cart not found" }
            });
        }

        // Find product index by ID
        const productIndex = cart.products.findIndex(p =>    p.id === parseInt(productId));
       
        
        if (productIndex === -1) {
            return res.status(404).json({
                status: "fail", 
                data: { data: "Product not found in cart" }
            });
        }

        // Remove the product from cart
        cart.products.splice(productIndex, 1);
        
        // Save the updated cart
        cart.markModified('products');
        await cart.save();

        return res.status(200).json({
            status: "success",
            data: {
                data: cart.products
            }
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occurred",
            code: 500,
            data: { data: err.message }
        });
    }
}));

// Update product quantity
router.patch('/:productId', verify, asyncwrapper(async (req, res) => {
    try {
        let name, email;
        if (typeof req.user === 'string') {
            const nameMatch = req.user.match(/name:\s*'([^']+)'/);
            const emailMatch = req.user.match(/email:\s*'([^']+)'/);
            name = nameMatch ? nameMatch[1] : 'Name not found';
            email = emailMatch ? emailMatch[1] : 'Email not found';
        } else {
            ({ name, email } = req.user);
        }

        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                status: "fail",
                data: { data: "Invalid quantity" }
            });
        }

        // Find the cart
        const cart = await cartsCollection.findOne({ name, email, isOrder: false });
        if (!cart) {
            return res.status(404).json({
                status: "fail",
                data: { data: "Cart not found" }
            });
        }

        // Find product index by ID - using proper comparison
        const productIndex = cart.products.findIndex(p => p.id === parseInt(productId));

        if (productIndex === -1) {
            return res.status(404).json({
                status: "fail",
                data: { data: "Product not found in cart" }
            });
        }

        // Update quantity
        cart.products[productIndex].quantity = quantity;
        
        // Mark as modified and save
        cart.markModified('products');
        await cart.save();

        return res.status(200).json({
            status: "success",
            data: {
                data: cart.products
            }
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occurred",
            code: 500,
            data: { data: err.message }
        });
    }
}));

// Clear the cart
router.delete('/', verify, asyncwrapper(async (req, res) => {
    try {
        let name, email;
        if (typeof req.user === 'string') {
            const nameMatch = req.user.match(/name:\s*'([^']+)'/);
            const emailMatch = req.user.match(/email:\s*'([^']+)'/);
            name = nameMatch ? nameMatch[1] : 'Name not found';
            email = emailMatch ? emailMatch[1] : 'Email not found';
        } else {
            ({ name, email } = req.user);
        }

        // Find and update the cart
        const cart = await cartsCollection.findOne({ name, email, isOrder: false });
        if (!cart) {
            return res.status(404).json({
                status: "fail",
                data: { data: "Cart not found" }
            });
        }

        cart.products = [];
        await cart.save();

        res.status(200).json({
            status: "success",
            data: {
                data: []
            }
        });

    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "An error occurred",
            code: 500,
            data: { data: err.message }
        });
    }
}));

// Get cart total items count
router.get('/total-items', verify, asyncwrapper(async (req, res) => {
    try {
        let name, email;
        if (typeof req.user === 'string') {
            const nameMatch = req.user.match(/name:\s*'([^']+)'/);
            const emailMatch = req.user.match(/email:\s*'([^']+)'/);
            name = nameMatch ? nameMatch[1] : 'Name not found';
            email = emailMatch ? emailMatch[1] : 'Email not found';
        } else {
            ({ name, email } = req.user);
        }

        // Find the cart
        const cart = await cartsCollection.findOne({ name, email, isOrder: false });
        if (!cart || !cart.products) {
            return res.status(200).json({
                status: "success",
                data: {
                    data: 0
                }
            });
        }

        // Calculate total items with validation
        const totalItems = cart.products.reduce((total, product) => {
            return total + (Number.isInteger(product.quantity) ? product.quantity : 0);
        }, 0);

        return res.status(200).json({
            status: "success",
            data: {
                data: totalItems
            }
        });

    } catch (err) {
        console.error('Cart total items error:', err);
        return res.status(500).json({
            status: "error",
            message: "An error occurred while calculating total items",
            code: 500,
            data: { data: err.message }
        });
    }
}));

// Get cart total price
router.get('/total-price', verify, asyncwrapper(async (req, res) => {
    try {
        let name, email;
        if (typeof req.user === 'string') {
            const nameMatch = req.user.match(/name:\s*'([^']+)'/);
            const emailMatch = req.user.match(/email:\s*'([^']+)'/);
            name = nameMatch ? nameMatch[1] : 'Name not found';
            email = emailMatch ? emailMatch[1] : 'Email not found';
        } else {
            ({ name, email } = req.user);
        }

        // Find the cart
        const cart = await cartsCollection.findOne({ name, email, isOrder: false });
        if (!cart || !cart.products) {
            return res.status(200).json({
                status: "success",
                data: {
                    data: 0
                }
            });
        }

        // Calculate total price with validation and rounding
        const totalPrice = cart.products.reduce((total, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = Number.isInteger(product.quantity) ? product.quantity : 0;
            return total + (price * quantity);
        }, 0);

        return res.status(200).json({
            status: "success",
            data: {
                data: Number(totalPrice.toFixed(2))
            }
        });

    } catch (err) {
        console.error('Cart total price error:', err);
        return res.status(500).json({
            status: "error",
            message: "An error occurred while calculating total price",
            code: 500,
            data: { data: err.message }
        });
    }
}));

module.exports = router;