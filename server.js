const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.raw({extended: true}));
const PORT = 3000;
const HOST = '0.0.0.0'

let db;
const { MongoClient } = require('mongodb');
const { ObjectID } = require('mongodb');
const collectionName = 'pathaoTest'
const { dburl } = require('./dbconfig');
MongoClient.connect( dburl ,(err, client)=>{
	if(err) return console.log(err);
	db = client.db('ehsandb');
	app.listen(PORT, HOST);
	console.log("Server is running");
})

var requestTime = function (req, res, next) {
  req.body.createdAt = Date.now();
  console.log(Date.now());
  next()
}

app.use(requestTime);

app.post('/values', (req,res) =>{
	db.collection(collectionName).save(req.body, (err, result)=>{
		if(err) return console.log(err);
		console.log("saved to database");
		res.status(201).send(req.body); 
	})
})
