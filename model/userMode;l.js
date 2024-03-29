const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt  = require('bcryptjs');
 const URL = "mongodb://127.0.0.1:27017/natours-test";
 const crypto = require('crypto')



const UserSchema = new Schema({
  name: {
    type: String,
    required: [true,'Please tell us your name!']
  },
  // Username: {
  //   type: String,
  //   required: true,

  // },
  email: {
    type: String,
    required: [true,'Please provide your email'],
    lowercase:true,
    unique: true,
   validate:[validator.isEmail,"Please provide a valid email"]
  },
  photo:String,

  role:{
    type:String,
    enum: ['user','guide','lead-guide','admin'],
    default: 'user',
  },

  password: {
    type: String,
    required:[ true,"Please input a password"],
    minlength:8,
    select:false
  },
  confirmPassword:{
     type: String,
    required: [true,"please confirm your password"],
    minlength:8,
    validate: {//works on CREATE and SAVE
      validator: function(el){
      return el === this.password
    }},
  message: 'Password are not the same'
  },

  changedPasswordAt : Date,
  passwordResetToken : String,
  passwordResetExpiresAfter : Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    this.password = await bcrypt.hash(this.password,12)
    this.confirmPassword = undefined;
    next()
})
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')|| this.isNew) {
    return next()
  }
this.changedPasswordAt = Date.now()
})
UserSchema.pre(/^find/,function(next) {
  this.find({
    active: {
    $ne:false,
  }})
})
//instance method, available on all documents in this collection
UserSchema.methods.correctPassword =  function(keyedPassword,userPassword){
  return bcrypt.compare(keyedPassword,userPassword)//compares the hashed password with the keyed in function
}

UserSchema.methods.changedPasswordAfter = function(JWTTimestamp){
if (this.changedPasswordAt) {
  console.log(this.changedPasswordAt,JWTTimestamp)
//convert to date
  const changedTimeStamp = parseInt(this.changedPasswordAt.getTime()/1000, 10)

  return JWTTimestamp < changedTimeStamp;
}
return false ///By default will/should return false
}

UserSchema.createUserResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  //then save to DB and compare with token input from the user

  this.passwordResetExpiresAfter = Date.now() + 10 *60*1000;
console.log({resetToken},this.passwordResetExpiresAfter)


  return resetToken;

}
//UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
