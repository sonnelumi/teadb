var express = require('express');
var router = express.Router();

// body parser
var bodyParser = require('body-parser');
var path = require ('path');
var querystring = require('querystring'); // get query string

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencode

var mongodb = require('mongodb');
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://teadb:dbteapass@ds149905.mlab.com:49905/heroku_bl98vszh';

module.exports.getAllOrders = function (request, response) {

    mongodb.MongoClient.connect(mongoDBURI, function(err, db) {
        if(err) throw err;

        //get collection of routes
        var Orders = db.collection('Orders');

        //FIRST showing you one way of making request for ALL routes and cycle through with a forEach loop on returned Cursor
        //   this request and loop  is to display content in the  console log
        var c = Orders.find({});

        c.forEach(
            function(myDoc) {
                console.log( "name: " + myDoc.name );  //just  loging the output to the console
            }
        );


        // SECOND -show another way to make request for ALL Routes  and simply collect the  documents as an
        //   array called docs that you  forward to the  getAllRoutes.ejs view for use there
        Orders.find().toArray(function (err, docs) {
            if(err) throw err;

            response.render('getAllOrders', {results: docs});
        });

        //close connection when your app is terminating.
        db.close(function (err) {
            if(err) throw err;
        });
    });//end of connect
};//end function


module.exports.storeData = function (request, response) {

    console.log(request);

    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        //get collection of routes
        var Orders = db.collection('Orders');

        //FIRST showing you one way of making request for ALL routes and cycle through with a forEach loop on returned Cursor
        //   this request and loop  is to display content in the  console log
        var c = Orders.find({});

        c.forEach(
            function (myDoc) {
                console.log("name: " + myDoc.name);  //just  loging the output to the console
            }
        );


        // SECOND -show another way to make request for ALL Routes  and simply collect the  documents as an
        //   array called docs that you  forward to the  getAllRoutes.ejs view for use there
        Orders.find().toArray(function (err, docs) {
            if (err) throw err;

            response.render('getAllOrders', {results: docs});
        });

        //close connection when your app is terminating.
        db.close(function (err) {
            if (err) throw err;
        });
    });//end of connect
};//end function