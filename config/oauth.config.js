require('dotenv').config({ path: "app.env" })

module.exports = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `https://e-commerce-mean-production.up.railway.app/api/v1/auth/google/callback`
  },
  session: {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }
};