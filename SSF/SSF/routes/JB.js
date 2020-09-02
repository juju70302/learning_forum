﻿'use strict';
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var uri = "mongodb://localhost:27017/";

//to public & private board

function test_type(req, res ,type) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("people").collection("manager_information");
        var findThing = { board_ID: req.body.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err || result.length == 0) throw err;
            db.close();
            //console.log(result);
            if (result[0]['type'] == type && type == 'public') {
                jumpboard(req, res);
            }
            else if (result[0]['type'] == type && type == 'private' && result[0]['password_public'] == req.body.password) {
                jumpboard(req, res);
            }
        });
    });
}

function jumpboard(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection(req.body.board_ID);
        var findThing = { hide: 'false' };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            //console.log(result);
            var pkg = { board_ID: board_ID, ID: ID, data: result, num: result.length };
            if (req.body.place)
                pkg['place'] = req.body.place;
            res.render('Page8', pkg );
        });
    });
}

//get introduce
function get_board_information(req, res) {
    MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var table = db.db("board").collection('all_board_number');
        var findThing = { board_ID: req.query.board_ID };
        table.find(findThing, { projection: { _id: 0 } }).toArray(function (err, result) {
            if (err) throw err;
            db.close();
            console.log(result);
            res.send({ title: result[0]['title'], introduce: result[0]['introduce'] });
        });
    });
}

//to post

router.post('/to_public_board', function (req, res) {
    test_type(req, res,'public');
});

router.post('/to_private_board', function (req, res) {
    test_type(req, res,'private');
});

router.get('/get_board_introduce', function (req, res) {
    get_board_information(req, res);
});

router.post('/to_post_page', function (req, res) {
    res.render('Page9', { ID: req.body.ID, board_ID: req.body.board_ID ,type: req.body.type});
    //res.render('Page9', { ID: 'leon1234858', board_ID: 'private_0002', type: 'private' });
});

module.exports = router;