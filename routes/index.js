var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'express testing!' });
});

module.exports = router;

var dbController = require('../controllers/database.js');

router.get('/getAllOrders', dbController.getAllOrders);