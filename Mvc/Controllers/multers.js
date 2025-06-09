
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try{
        cb(null, './Mvc/assets');  }// تحديد مجلد الحفظ
        catch(err){
            console.log({err:err.message});
            
        }
    },
    filename: function (req, file, cb) {
        try{
        cb(null, Date.now() + '-' + file.originalname);  // تخصيص اسم الملف
        }
        catch (err) {
            console.log({ err: err.message });

        }
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }  // الحد الأقصى لحجم الملف: 10 mb
    // fileFilter: (req, file, cb) => {
    //     // فقط السماح بملفات الصور
    //     if (!file.mimetype.startsWith('image/')) {
    //         return cb(new Error('Only image files are allowed!'), false);
    //     }
    //     cb(null, true);
    // }
});

module.exports = upload

