const mongoose = require("mongoose");
const User = require('./userMode;l')
const slugify = require('slugify')

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true,'Review cannot be empty'],
    trim:true
  },
  rating: {
    type: Number,
    default:0,
    min:1,
    max:5
  },
createdAt:{
  type:Date,
  default:Date.now(),
  //select:false
},
// guides:Array,
User:[
  {
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required:[true,'Review must come from a User']
  },
],
tourInfo:[{

        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Review must belong to a tour.']

}],
},{
    toJSON:{ virtuals:true},
    toObject:{virtuals:true}
  });

  reviewSchema.pre(/^find/,function (next) {
    this.populate({path:'tourInfo',
    select:'-_v -passwordChangedAt'
    });
    this.populate({path:'User',
    select:'-_v -passwordChangedAt'
    });
    next()
  })

  
const Review = mongoose.model('Review',reviewSchema);


module.exports = Review;
