const express = require('express');
const app = express();
const Gun = require('gun');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Dimension = require('./models/dimension');
require('dotenv').config();
require('gun/lib/bye')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/raygun', { useNewUrlParser: true });

let server = app.listen(process.env.PORT || '3000');
let gun = Gun({
  web: server
});

//App Setting
app.set('views', './client/components')
app.set('view engine', 'pug');
app.use(Gun.serve).use(express.static(__dirname));
app.use(express.static('client'))
app.use(express.static('client/components/raygun'))
app.use('/client/components', express.static(__dirname + '/client/components'));
app.use(express.json());
app.use(cookieParser());

//Check that a user is logged in
let checkAuth = function (req, res, next) {
  if (typeof req.cookies.userToken === 'undefined' || req.cookies.userToken === null) {
    req.user = null;
  } else {
    // if the user has a JWT cookie, decode it and set the user
    var token = req.cookies.userToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }
  next();
}
app.use(checkAuth);

app.get('/*', (req, res) => {
  let thisUserId = req.user ? req.user.id : null;
  User.findById(thisUserId).then((user) => {
    if(!user){
      res.clearCookie('userToken');
    }
    res.render('main', {
      currentUser : req.user,
      raygunPublicKey : process.env.RAYGUN_PUBLIC_KEY
    })
  });
})

//Controllers
require('./controllers/user.js')(app, gun);
