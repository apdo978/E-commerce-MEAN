const express = require('express');
const app = express();
const connectDB = require('./Mvc/config/dbconfig.js');
const Userroute = require('./Mvc/routs/userrouts.js')
const productroute = require('./Mvc/routs/productsrouts.js')
const cartRoutes = require('./Mvc/routs/cartRoutes.js')
const OAuthRoutes = require('./Mvc/routs/auth.routes.js');
const routes = express.Router()
require('dotenv').config({ path: "app.env" })
const jwt = require('jsonwebtoken')
const rateLimit = require('express-rate-limit');
const upload = require('./Mvc/Controllers/multers.js').upload;
const usertyperoute = require('./Mvc/routs/userTypesroutes');
const cors = require('cors')
const orders = require('./Mvc/routs/adminrouts.js')
const fs = require("fs");
const path = require("path");
const morgan = require('morgan');//logger package
const session = require('express-session');
const passport = require('./Mvc/authrization/passport');
const config = require('./config/oauth.config');

// API Version
const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

// Middleware
app.use(express.json());
app.use(morgan('dev')); // Request logging

const allowedOrigins = [
    'https://apdo978.github.io',
    'https://abdelrhman-dev.me',
    'http://localhost:4200',
];
// CORS configuration
app.use(cors(
    {
        origin: function (origin, callback) {
            // !origin || allowedOrigins.includes(origin)
            if (true) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));
// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again later.'
    }
});

// Apply rate limiting to all routes
app.use(limiter);

// File upload handling
// const uploadsDir = path.join(__dirname, "Mvc/assets");
// app.get(`${API_PREFIX}/uploads`, (req, res) => {
//     fs.readdir(uploadsDir, (err, files) => {
//         if (err) {
//             return res.status(500).json({
//                 status: 'error',
//                 message: "Error reading directory"
//             });
//         }

//         const filesList = files.map(file => ({
//             name: file,
//             url: `${API_PREFIX}/uploads/${file}`
//         }));

//         res.json({
//             status: 'success',
//             data: filesList
//         });
//     });
// });

// File upload route
app.post(`${API_PREFIX}/upload`, upload.array('file', 5), (req, res) => {
    try {
        res.json({
            status: 'success',
            message: 'Files uploaded successfully',
            files: req.files
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
});

// Serve static files
app.use(`${API_PREFIX}/uploads`, express.static("./Mvc/assets"));
app.use(`${API_PREFIX}/avatars`, express.static("./Mvc/avatars"));


// Database connection
connectDB();

app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());


// API Routes
app.use(`${API_PREFIX}/users`, Userroute);
app.use(`${API_PREFIX}/admins`, orders);
app.use(`${API_PREFIX}/products`, productroute);
app.use(`${API_PREFIX}/cart`, cartRoutes);
app.use(`${API_PREFIX}/user-types`, usertyperoute);
app.use(`${API_PREFIX}/auth`, OAuthRoutes );



// Health check route
app.get(`${API_PREFIX}/health`, (req, res) => {
    res.json({
        status: 'success',
        message: 'API is running',
        version: API_VERSION,
        timestamp: new Date()
    });
});

// 404 handler
app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} !`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    res.status(statusCode).json({
        status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});


const PORT = process.env.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Version: ${API_VERSION}`);
});
