const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt  = require('bcrypt');
 const URL = "mongodb://127.0.0.1:27017/natours-test";

mongoose.connect(URL);

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
  changedPasswordAt : Date
}); 

//mongoose middleware PRE('save') encrypt password
UserSchema.pre('save', async function(next) {
  //run if password  if password was actually modified
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password,12)//hash password
  this.confirmPassword = undefined;//deactivate confirm password
  next()
})


//instance method, available on all documents in this collection
UserSchema.methods.correctPassword =  function(keyedPassword,userPassword){
  return bcrypt.compare(keyedPassword,userPassword)//compares the hashed password with the keyed in function
}

UserSchema.methods.changedPasswordAfter = function(JWTTimestamp){
if (this.changedPasswordAt) {
  console.log(this.changedPasswordAt,JWTTimestamp)
//convert to date
  const changedTimeStamp = parseInt(this.changedPasswordAt.getTime()/1000,10) 

  return JWTTimestamp < changedTimeStamp;
}
return false ///By default will/should return false 
}
//UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
