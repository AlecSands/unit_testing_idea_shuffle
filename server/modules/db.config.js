var mongoose = require('mongoose');

// Mongo Connection //
var mongoURI = '';
// process.env.MONGODB_URI will only be defined if you
// are running on Heroku
if(process.env.MONGODB_URI != undefined) {
    // use the string value of the environment variable
    mongoURI = process.env.MONGODB_URI;
} else {
    // var mongoRefs = require('/connections.js');
    // use the local database server
    // mongoURI = mongoRefs.MONGODB_URI;
    mongoURI = 'mongodb://Alec:test@ds015869.mlab.com:15869/ideashuffletest';
}

// var mongoURI = "mongodb://localhost:27017/passport";
var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
   if(err) {
     console.log("MONGO ERROR: ", err);
   }
   res.sendStatus(500);
});

mongoDB.once('open', function(){
   console.log("Connected to Mongo!");
});

module.exports = mongoDB;
