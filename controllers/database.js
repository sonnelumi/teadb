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
    mongodb.MongoClient.connect(mongoDBURI, function (err, db) {
        if (err) throw err;

        // autogenerate ids because retrieve_id info doesn't seem to function on heroku
        var customerID = Math.floor((Math.random() * 1000000000000) + 1);
        var billingID = Math.floor((Math.random() * 1000000000000) + 1);
        var shippingID = Math.floor((Math.random() * 1000000000000) + 1);

        var body = JSON.parse(JSON.stringify(request.body));

        // have to call four  different collections

        var customerData =
            {
                _id: customerID,
                firstName: body.firstName,
                lastName: body.lastName,
                streetAddress: body.streetAddress,
                streetAddress2: body.streetAddress2,
                city: body.city,
                state: body.state,
                zip: body.zip,
                email: body.email
            };

        var Customers = db.collection('Customers');

        Customers.insertOne(customerData, function (err, result) {
            if (err) throw err;
        });

        var billingData =
            {
                _id: billingID,
                customerID: customerID,
                creditCardNumber: body.creditCardNumber,
                creditCardType: body.creditCardType,
                creditCardExpiration: body.creditCardExpiration,
                creditCardName: body.creditCardName
            };

        var Billing = db.collection('Billing');

        Billing.insertOne(billingData, function (err, result) {
            if (err) throw err;
        });

        var shippingData =
            {
                _id: shippingID,
                customerID: customerID,
                streetAddress: body.streetAddress,
                streetAddress2: body.streetAddress2,
                city: body.city,
                state: body.state,
                zip: body.zip
            };


        var Shipping = db.collection('Shipping');

        Shipping.insertOne(shippingData, function (err, result) {
            if (err) throw err;
        });

        var date = new Date();

        var orderData =
            {
                customerID: customerID,
                billingID: billingID,
                shippingID: shippingID,
                date: date.toDateString(),
                productVector: body.productVector,
                orderTotal: body.orderTotal
            };

        //get collection of orders
        var Orders = db.collection('Orders');

        Orders.insertOne(orderData, function (err, result) {
            if (err) throw err;
        });

        console.log(body.productVector);

        var productVector = JSON.parse(body.productVector);

        console.log(productVector);
        for (var product in productVector) {
            console.log(product);
            console.log(product['code']);
            console.log(product['quantity']);
            console.log(product['name']);
        }

        response.render('storeOrder', {summary: body, products: productVector});

        //close connection when your app is terminating.
        db.close(function (err) {
            if (err) throw err;
        });
    });//end of connect
};//end function