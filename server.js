const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.raw({extended: true}));

const PORT = 3000;
const HOST = '0.0.0.0'
const TTL = 30000;
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

app.post('/values', (req,res) =>{
	var keys =  [];
	for (var key in req.body) {
	    if (req.body.hasOwnProperty(key)) {
	    	var obj = {};
	    	obj[key] = req.body[key];
	    	obj['createdAt'] = Date.now();
	    	keys.push(obj);
	       	console.log(key + " -> " + req.body[key]);
	    }
	}
	
	db.collection(collectionName).insertMany(keys, (err, result)=>{
		if(err) return console.log(err);
		console.log("saved to database");
		res.status(201).send(keys); 
	})
	
})
