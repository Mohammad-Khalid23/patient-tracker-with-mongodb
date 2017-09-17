const http = require('http');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
const express = require('express');
var mongo = require('mongodb').MongoClient
var objectId = require('mongodb').ObjectID
var assert = require('assert')

//setup server
const app = express();
var URL = "mongodb://localhost:27017/test";

//server listen on 8000 port
app.listen(8000,function(){
console.log("running on 8000")
});

//parsing post data
app.use(bodyParser.json(),function(err,req,res,next){
  if(err){
    return res.status(500).json({error:err})
  }
  next();
});
app.use(bodyParser.urlencoded({ extended: true }))


// //user schema
// mongoose.connect('mongodb://localhost/user',{
//   useMongoClient:true
// })

// var infoSchema = mongoose.Schema({
//   name:String,
//   age:String
// })

// var model = mongoose.model("user",infoSchema);

var cors = require('cors')
cors({ credentials: true, origin: true })
app.use(cors())

app.post('/patient', (request, response) => {
  response.header('Access-Control-Allow-Origin', "*"); 
  response.send("hello baby")
  console.log(request.body,"My Name")
  var patientdata ={
    name: request.body.name,
    disease:request.body.disease,
    doctorName :request.body.doctorName,
    date:request.body.date
  }

  mongo.connect(URL,function(err,db){
    assert.equal(null,err);
    db.collection("patient-data").insertOne(patientdata,function(err,result){
      assert.equal(null,err);
      console.log("added successfully")
      db.close();
    })
  })

})

//delete patient
app.post('/deletePatient', (request, response) => {
  response.header('Access-Control-Allow-Origin', "*"); 
  response.send("deleting")
  console.log(request.body.removePatient,"deleteiiiiiiiiiiiiiiiiiii")


  mongo.connect(URL,function(err,db){
    assert.equal(null,err);
    db.collection("patient-data").deleteOne({"_id":objectId(request.body.removePatient)},function(err,result){
      assert.equal(null,err);
      console.log("deleted successfully")
      db.close();
    })
  })

})
app.get('/patientdata', (request, response) => {
  var newarray=[];
  response.header('Access-Control-Allow-Origin', "*"); 

  mongo.connect(URL,function(err,db){
    assert.equal(null,err);

    var cursor =  db.collection("patient-data").find();
    cursor.forEach(function(docs,err){
      newarray.push(docs);
    },function(){
      db.close();
      response.send(newarray)
      console.log(newarray,"db data")
    })
  })

})

