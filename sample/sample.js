const express = require('express');
const app = express();
const fs = require("fs");
const path = require("path")



app.use(express.json())
const uploadsDir = path.join(__dirname, "Mvc/assets"); // تحديد مسار المجلد
app.get("/Uploads", (req, res) => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: "Error reading directory" });
        }

        // إنشاء JSON يحتوي على قائمة الملفات
        const filesList = files.map(file => ({
            name: file,
            url: `/Uploads/${file}` // URL لتحميل الملف
        }));

        res.json({ files: filesList });
    });
});


