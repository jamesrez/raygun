const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new Schema({
  username : String,
  password : String,
  admin : Boolean,
  dimensions : [String],
  ideas : [String],
  things : [String],
  raygun : String
});

// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};


const User = mongoose.model('User', UserSchema);

module.exports = User;
