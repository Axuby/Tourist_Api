const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt  = require('bcrypt');
 const URL = "mongodb://127.0.0.1:27017/Test";

mongoose.connect(URL);

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  Username: {
    type: String,
    required: true,
   
  },
  email: {
    type: String,
    required: true,
    lowercase:true,
    unique: true,
   validate:[validator.isEmail,"Please input a correct Password"]
  },
  password: {
    type: String,
    required:[ true,"Please input a correct password"],
    minlength:8,
  },
  confirmPassword:{
     type: String,
    required: [true,"please confirm password"],
  minlength:8,
    validate: {
  validator: function(el){
  return el === this.password
}}
  }
}); 


UserSchema.pre('save', async function(next) {
  //run this password  if password was actually modified
  if (!isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash( this.password,12)//hash password
  this.confirmPassword = undefined;//inactivate confirm password
})
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("user", UserSchema);
