const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secret_key = process.env.JWT_SECRET

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.CLIENT_URL}`,
    session: true 
  }),
  (req, res) => {
    
    console.log("User authenticated successfully",req.user );
    let { name, email, createdAt:iat } = req.user;
    iat = Math.floor(new Date(iat).getTime() / 1000) 
    const token = jwt.sign({name,email,iat}, secret_key)

    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);
  }
);

module.exports = router;