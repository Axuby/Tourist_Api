const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const user = require("./model/userMode;l");

const app = require('./app');
const Tour = require("./model/tourModel");

const db_password = process.env.DB_PASSWORD
const URL = "mongodb://127.0.0.1:27017/Tourist";
// const uri = `mongodb+srv://azubyne:${db_password}@cluster0.2dnjkbr.mongodb.net/Tourist?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://azubyne:${db_password}@cluster0.2dnjkbr.mongodb.net/Tourist?retryWrites=true&w=majority`;
const DB_URL_  = process.env.DB.replace('<password>', db_password) || URL;

// });
//uncaught exceptions  errors in our code that we didnt care to write
// our node app is in a cleaning state
// process.on('uncaughtException',err => {
//   console.log('ERROR',err.name,err.message)
//   console.log('UNCAUGHT EXCEPTION! shutting down ....')
//   process.exit(1)
// })


mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then((con) => {
    // console.log(con.connections)
    console.log("Successfully connected to DB");
  }).catch(err => {
    console.log("first")
    console.log(err);
  });

const port = process.env.PORT || 4100;

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

//Unhandled rejections
// process.on('unhandledRejection',err =>{
//   console.log('ERR',err.name,err.message)
//   console.log('UNHANDLED REJECTION! shutting down ....')
// server.close(()=>{
//   process.exit(1)
// })
// })


