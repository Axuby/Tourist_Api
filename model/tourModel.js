const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number
  },
  difficulty:{
      type:String,
     // require:[true,'Please input the Difficulty']
  },
  description:{
type:String,
trim:true
  },
  MaxGroupSize:{
      type:Number,
     // required:[true,'please your group size']
  },
  Duration:{
      type:Number,
      //required:[true,'Please specify the duration']
  },
  price: {
    type: Number,
    required: true
  },
  imageCover:{
type:String,
required:true
  },
  images:[String],
createdAt:{
  type:Date,
  default:Date.now(),
  select:false
}
});

const Tour = mongoose.model('Tour',tourSchema)
module.exports = Tour