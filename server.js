const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.raw({extended: true}));

const PORT = 3000;
const HOST = '0.0.0.0'

const TTL = 300000;

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
	    	obj['key'] = key;
			obj['value'] = req.body[key];
	    	obj['createdAt'] = Date.now();
	    	keys.push(obj);
	       	console.log(key + " -> " + req.body[key]);
	    }
	}
	
	db.collection(collectionName).insertMany(keys, (err, result)=>{
		if(err) return console.log(err);
		console.log("saved to database");
		res.status(201).send(req.body); 
	})	
})

app.get('/values', (req,res) =>{
	clear();
	const keys = req.query.keys;
	if(keys == null){
		db.collection(collectionName).find().toArray((err, result)=>{
			if(result[0]==null){
				res.status(404).send("404 Not Found!!");
			}
			else{
				var responseObject = {}
				for(var i=0;i<result.length;i++){
					responseObject[result[i]['key']] = result[i]['value'];
				}
				res.send(responseObject);
				resetAllTTL();	
			}	
		})
	}
	else{
		var keysArray = keys.split(',');
		db.collection(collectionName).find({ key: { $in: keysArray } }).toArray((err, result)=>{
			if(result[0]==null){
				res.status(404).send("404 Not Found!!");
			}
			else{
				var responseObject = {}
				for(var i=0;i<result.length;i++){
					responseObject[result[i]['key']] = result[i]['value'];
				}
				res.send(responseObject);
				resetTTL(keysArray);
			}
		})
	}
})

app.patch('/values', (req,res) =>{
	for (var key in req.body) {
	    if (req.body.hasOwnProperty(key)) {
	       	console.log(key + " -> " + req.body[key]);
	       	 db.collection(collectionName)
			    .update({
			        "key": key
			    }, {
			        $set: {
			        	"value": req.body[key],
			        	"createdAt":  Date.now()
			        }
		    });
	    }
	}
	res.status(204).send("");
})

app.all('*',(req,res) =>{
    res.status(404).send("ERROR 404 Not Found!!!");
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Internal Server error!!!')
})

var resetAllTTL = function(){
	db.collection(collectionName)
	.updateMany({ }, {
	    $set: {
	    	createdAt: Date.now()
	    }
	});
}

var resetTTL = function(keysArray){
	db.collection(collectionName)
	.updateMany({ key: { $in: keysArray }}, {
	    $set: {
	    	createdAt: Date.now()
	    }
	});
}

var clear = function() {
	var min = Date.now() - TTL;
	console.log(min);
	db.collection(collectionName).remove({
		createdAt: {$lt: min}
	});
};