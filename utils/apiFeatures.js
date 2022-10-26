 // const tour = new Tour();
class APIFeatures {
    constructor(query,queryStr){ //queryStr from express req.query,query from mongoose
      this.query = query;
      this.queryStr = queryStr
    }

    filter(){
              const queryObj = {...this.queryStr}//{...req.query};
              const excludeFields = ['page','limit','sort','fields']//exclude this from the query
              excludeFields.forEach(element => {
                return delete queryObj[element]
              });

              let queryString = JSON.stringify(queryObj)
              queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
              console.log(queryString)

              this.query.find(JSON.parse(queryString))

              return this;//the entire object

          }

  sortBy() {
      console.log(this.queryStr)
        if (this.queryStr.sort) {
          const sortBy =this.query.sort.split(',').join('')//to sort by 2 or more parameters
        this.query = this.query.sort(sortBy)
        }else{
          this.query = this.query.sort('-createdAt') // if not specified sort by createdAt
        }
        return this;
    }

    limitFields(){
        if (this.queryStr.fields) {
          const fields = this.queryStr.fields.split(',').join(' ')//mProjecting = process of selecting fieldnames by mongoose requests for string with field names separated by spaces
        this.query = this.query.select(fields) //eg select('name duration price)

        } else {
          this.query = this.query.select('-__v') //default incase  doesn't specify fields,exclude this field
        }




      return this
    }


    paginate(){
      const page = this.queryStr.page * 1|| 1;
      const limit = this.queryStr.limit* 1 ||  100;
      const skip = (page - 1) * limit
      this.query =  this.query.skip(skip).limit(limit)

      return this
  // if (this.queryStr.page) {
  //   const numOfTours = await Tour.countDocuments()

  //   if (skip >= numOfTours) {
  //     throw new Error('This page doesn't exist')
  //   }
  }




  }
  // );

module.exports = APIFeatures;