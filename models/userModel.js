const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'User must provide a valid password'],
    trim: true,
    minlength: [8, 'User password must be equal or more than 8 character'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must provide a valid password'],
    //this only runs on CREATE and SAVE
    validate: {
      validator: function(val) {
        return val === this.password;
      },
      message: 'Password must be the same'
    },
    trim: true,
    minlength: [8, 'User password must be equal or more than 8 character']
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  // passwordConfirm it's used just for validation
  // be set undefined the field will not get to the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model('User', userSchema);

module.exports = User;
