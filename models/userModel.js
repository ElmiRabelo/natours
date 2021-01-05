const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'User must provide a valid password'],
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
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // be set undefined the field will not get to the database
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function(next) {
  // if new document just return next
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changesPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    // Verify if the password changed date occured after the token be created.
    return JWTTimestamp < changedTimestamp;
  }
  // false means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set time to 30 min
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  // like password, the encrypted data stay in the db and the user it'll see the reset token unencrypted
  return resetToken;
};

const User = model('User', userSchema);

module.exports = User;
