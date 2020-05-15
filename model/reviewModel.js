
const  Tour = require('./tourModel')
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
    // this.populate({path:'tourInfo',
    // select:'-_v -passwordChangedAt name'
    // }).populate({path:'User',
    // select:'-_v -passwordChangedAt name photo'//dont leak every private data about the user
    // });
    this.populate({path:'User',
    select:'-_v -passwordChangedAt name photo'//dont leak every private data about the user
    });
    next()
  })
  //virtual populate populates the model but doesnt persist it on the DB
reviewSchema.static.calcAverageRatings = async function (tourId) {
   const stats = await this.aggregate([{ //this points to the model
        $match:{tour:tourId}
    },
    { 
        $group:{
            _id:'$tour',//group by tour
            nRating: {$sum :1},
            avgRating:{$avg :'$rating'}
        }
    }

])
console.log(stats)
  await  Tour.findByIdAndUpdate(tourId,{
    ratingsQuantity:stats[0].nRating,
    ratingsAverage:stats[0].avgRating,
})
}
  reviewSchema.post('save',function () {
      this.constructor.calcAverageRatings(this.tour)//instead of this.Review ,this.constructor points to the current model
  })
//findByIdandDelete and Update
  reviewSchema.pre(/^findOneAnd/,async function (next) {
      this.rv = await this.findOne() 
      console.log(this.rv)
      next()

  })
  reviewSchema.post(/^findOneAnd/,async function () {//here query has been executed and passed
     await this.rv.constructor.catchAverageRatings(this.rv.tour)
})
const Review = mongoose.model('Review',reviewSchema);


module.exports = Review;
