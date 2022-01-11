//jshint esversion:6

const express = require("express") ; 
const bodyParser = require("body-parser") ; 
const mongoose = require("mongoose") ; 
const { request } = require("express");
const app = express() ; 

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/BloodBankDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const donorRegSchema = new mongoose.Schema({
    _name : String ,
    _BloodGroup : String ,
    _State: String ,
    _City: String ,
    _MobNum: Number ,
    _Ailments : String ,
    _PrevDonationDate : String ,
    _email : String ,
    _password : String 

}) ; 

const sendReqSchema = new mongoose.Schema({
  _name : String , 
  _email : String ,
  _MobNum: Number ,
  _BloodGroup : String ,
  _State: String ,
  _City: String ,
}) ; 

const SendReq = mongoose.model("SendReq" ,sendReqSchema) ; 

const DonorReg = mongoose.model("DonorReg" , donorRegSchema) ; 

  app.use(bodyParser.urlencoded({extended:true})) ; 
  app.use(express.static("public")) ; 

  app.get("/",function(req,res){
      res.sendFile(__dirname+"/index.html") ; 
  }) ; 

  app.post("/donorReg",function(req,res){
    var name = req.body.DonorName ; 
    var BloodGroup = req.body.BloodGroup ; 
    var State = req.body.State ;
    var City = req.body.City ; 
    var MobNum = Number(req.body.MobNum) ; 
    var Ailments = req.body.Ailments ; 
    var PrevDonationDate = req.body.PrevDonationDate ; 
    var email = req.body.email ; 
    var password = req.body.password ; 

    const donor = new DonorReg({
      _name : name , 
      _BloodGroup : BloodGroup  ,
      _State : State  ,
      _City : City ,
      _MobNum : MobNum ,
      _Ailments : Ailments ,
      _PrevDonationDate : PrevDonationDate  ,
      _email : email  ,
      _password : password 
    }) ;

    donor.save() ;
    res.sendFile(__dirname+"/public/success.html") ; 
    app.post("/success",function (req,res) {
      res.redirect("/");
  }) 

    DonorReg.find(function(err,donors){
      if(err){
        console.log(err) ; 
      }else{
        console.log(donors) ; 
      }
    }) ; 

  })

  app.post("/sendReq" , function(req,res){
    var name = req.body.name ; 
    var email = req.body.email ; 
    var MobNum = Number(req.body.mobNum) ; 
    var BloodGroup = req.body.BloodGroup ; 
    var State = req.body.State ;
    var City = req.body.City ; 

    const request = new SendReq({
      _name : name ,
      _email : email , 
      _MobNum : MobNum , 
      _BloodGroup : BloodGroup , 
      _State : State ,
      _City : City
    }) ; 

    // request.save() ; 
    DonorReg.find({_BloodGroup:request._BloodGroup , _State:request._State},function(err,donors){
      if(err){
        console.log(err) ; 
      }else{
        if(donors.length===0){
          request.save() ; 
          res.sendFile(__dirname+"/public/success.html") ; 
          app.post("/success",function (req,res) {
            res.redirect("/");
        }) 

        }else{
          res.render("list_matchRequest", {listTitle: "Matched results", newListItems: donors});
        }
        
      }
    }) ; 
  })

//   Fruit.find(function(err,fruits){
//     if(err){
//         console.log(err);
//     }
//     else{
//         mongoose.connection.close();
//        // console.log(fruits.name);

//         fruits.forEach(function(fruit){
//             console.log(fruit.name);
//         })
//     }
// });

// res.render("list", {listTitle: "All requests", newListItems: items});

  app.post("/viewReq" , function(req,res){
    
    SendReq.find(function(err,requests){
      // console.log(requests) ; 
      // res.send("Hi") ; 
      // res.send(requests) ; 
      if(err){
        // console.log("inside err block") ; 
        console.log(err) ; 
      } else{
         console.log("inside else block") ; 
         res.render("list" , {listTitle: "All requests", newListItems: requests} ) ; 
        //  requests.forEach(function(r){
          //  res.send(r._name) ; 
           // res.send(r) ; 
        //  }) 
        //  res.write("Here") ;
        //  res.write(requests) ; 
      }
    }) ;

  })



  app.listen(3000,function(){
      console.log("Server running on port 3000.") ; 
  }) ;



 // mongoose.connection.close() ; 