// Import the multer library, which is middleware for handling file uploads
const multer = require('multer');

// Configure where and how files will be stored
const storage = multer.diskStorage({
    // Function to determine the destination folder for uploaded files
    destination: function (req, file, cb) {
        try{
        cb(null, './Mvc/assets');  }// Callback that sets the destination folder to './Mvc/assets'
        catch(err){
            console.log({err:err.message});
            
        }
    },
    // Function to determine the filename for uploaded files
    filename: function (req, file, cb) {
        try{
        cb(null, Date.now() + '-' + file.originalname);  // Create unique filename using timestamp + original filename
        }
        catch (err) {
            console.log({ err: err.message });

        }
    }
});
const avatarstorage = multer.diskStorage({
    // Function to determine the destination folder for uploaded files
    destination: function (req, file, cb) {
        try{
        cb(null, './Mvc/avatars');  }// Callback that sets the destination folder to './Mvc/assets'
        catch(err){
            console.log({err:err.message});
            
        }
    },
    // Function to determine the filename for uploaded files
    filename: function (req, file, cb) {
        try{
        cb(null, Date.now() + '-' + file.originalname);  // Create unique filename using timestamp + original filename
        }
        catch (err) {
            console.log({ err: err.message });

        }
    }
});

// Create the multer middleware instance with our configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }  // Set maximum file size limit to 10 megabytes
    // Commented out code below would restrict uploads to image files only
    // fileFilter: (req, file, cb) => {
    //     // Only allow image files
    //     if (!file.mimetype.startsWith('image/')) {
    //         return cb(new Error('Only image files are allowed!'), false);
    //     }
    //     cb(null, true);
    // }
});
const avatarupload = multer({
    storage: avatarstorage,
    limits: { fileSize: 5 * 1024 * 1024 },  // Set maximum file size limit to 5 megabytes for avatars
    fileFilter: (req, file, cb) => {
        // Only allow image files for avatars
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed for avatars!'), false);
        }
        // Check for specific image types
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed!'), false);
        }
        cb(null, true);
    }
});

// Export the configured multer middleware to be used in route handlers
module.exports = {upload, avatarupload}

