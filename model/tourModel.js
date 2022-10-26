const mongoose = require("mongoose");
const User = require('./userMode;l')
const slugify = require('slugify')
const validator = require('validator');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true,
    maxlength:[40,'A Tour must have less or equal than 40 characters'],
    minlength:[40,'A Tour must have more or equal than 10 characters'],
    validate:[validator.isAlpha,'Tour name must only contain alpha characters']
  },
  slug:String,
  ratingsAverage:{
      type:Number,
      default:4.5,
      min:[1, 'Rating must be above 1.0'],
      max:[1, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10)/10
        },
  ratingsQuantity:{
      type:Number,
      default:0
        },
  rating: {
    type: Number,
    default:0
  },
  difficulty:{
      type:String,
     require:[true,'Please input the Difficulty'],
     enum:{
       values: ['easy','medium','difficult'],
      message:'Difficulty can only be either: difficult, medium and easy'
      }
  },
  description:{
      type:String,
      trim:true
        },
  MaxGroupSize:{
      type:Number,
      required:[true,' A Tour must have a group size,please your group size']
  },
  Duration:{
      type:Number,
      required:[true,'A Tour must have a duration,Please specify the duration']
  },
  secretTour:
  {
    type:Boolean,
    default:false,
  },
    price: {
      type: Number,
      required: true,
  },
  priceDiscount:{
  type:Number,
  validate:{
  validator:function(val){
      return val < this.price;
    },
  message:'Discount {VALUE} should be below the regular price'
  }
  } ,
  imageCover:{//just the name of the image and read from the fileSystem and a reference stored in the DB
  type:String,//image is stored i the fs and a ref is stored in the DB
  required:[true, 'A tour must have a cover image']

  },
  images:[String],//an array of strings
  createdAt:{
    type:Date,
    default:Date.now(),
    select:false//would be returned on querying
  },
  startDates:[Date],
  startLocation:{//GeoJSON
    type:{
      type:String,
      default:'point',
      enum:['point']
    },
    coordinates: [Number],//longitude and lat instead of vice versa
    address: String,
    description: String,

},
  location :[{ //GeoJSON
    type:{
      type:String,
      default:'point',
      enum:['point']
    },
    coordinates: [Number],
     address: String,
    day:Number
}],
// guides:Array,
guides:[
  {
    type:mongoose.Schema.ObjectId,
    ref:'User'
  }
],
// reviews:[{
//   type:mongoose.Schema.ObjectId,virtual
//   ref:'Review'
// }],
summary:{
  type:String,
  trim:true,
  required:[true,'A tour must have a summary ']
  //not on the website
},
},{
  toJSON:{ virtuals:true}, //schema options for the data return,return the virtuals
  toObject:{virtuals:true}
});

tourSchema.index({price:1,ratingsAverage:-1})
tourSchema.index({slug:1})
//Virtual properties - can be derived  from one another thus not necessary to store in Db

tourSchema.virtual('reviews',{ //populate the review only on getOneTour request and not getAllTour
    ref:'Review',                //thus done only on the getOneTour controller
  foreignField:'tour',
  localField:'_id'  //the place where virtual populate model is called the review Model
})

tourSchema.virtual('durationWeeks').get(function(){
  return this.Duration/7
});
//b4 .save() and .create() but not insertMany()
tourSchema.pre('save',function(next){ //this is pointing to the currently saved Doc

  this.slug = slugify(this.name, {lower:true})
  next()
})
tourSchema.pre('save',async function(next){ //this is pointing to the currently saved Doc

  const guidesPromise = this.guides.map(async id => await User.findById(id))
  this.guides = await Promise.all(guidesPromise)
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


//query middleware (post-find Hook)
tourSchema.pre(/^find/,function (next) {
  this.populate({
  path: 'guides',
  select:'-_v -passwordChangedAt'
  });
  next()
})

//query middleware (post-find Hook)
tourSchema.post(/^find/,function(docs, next){
  console.log(`QUery took ${Date.now()- this.start}  milliseconds}`)
  next()
})


//aggregation middleware with aggregate Hook
tourSchema.pre('aggregate',function(next){
  this.pipeline().unshift({
    $match:{
      secretTour:{
        $ne:true}
      }
    })
  console.log(this.pipeline())
  next()
})


const Tour = mongoose.model('Tour',tourSchema)
module.exports = Tour

//mongooses middleware types
// document- acts on currently processed middleware
// query
// aggregate
// model