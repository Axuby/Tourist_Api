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
guides:[
  {
    type:mongoose.Schema.ObjectId,
    ref:'User'
  },
],
tourInfo:[{

        type:mongoose.Schema.ObjectId,
        ref:'Tour'

}],
summary:{
  type:String,
  trim:true,
  required:[true,'A tour must have a summary ']
  //not on the website 
},

},{
  toJSON:{ virtuals:true},
  toObject:{virtuals:true}
});
//Virtual properties - can be derived  from one another thus not necessary to store in Db

tourSchema.virtual('durationWeeks').get(function(){
  return this.Duration/7
});

//b4 .save() and .create() but not insertMany()
tourSchema.pre('save',function(next){ //this is pointing to the currently saved Doc
  this.slug = slugify(this.name, {lower:true})
  next()
})
// tourSchema.pre('save ',async function (next) {
//  const guidesPromises =  this.guides.map(async (id)=> await User.findById(id))
//  this.guides = await Promise.all(guidesPromises)
// })

tourSchema.pre(/^find/,function(next){
  this.find({secretTour:{ $ne:true}})
  this.start = Date.now()
  next()
})

tourSchema.pre(/^find/,function (next) {
  this.populate({path:'guides',
  select:'-_v -passwordChangedAt'
  });
})
tourSchema.post(/^find/,function(docs,next){
  console.log(`QUery took ${Date.now()- this.start}  milliseconds}`)
  next()
})

tourSchema.pre('aggregate',function(next){
  this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
  console.log(this.pipeline())
  next()
})


const Review = mongoose.model('Review',reviewSchema)
module.exports = Review
