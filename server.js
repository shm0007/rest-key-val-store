const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.raw({extended: true}));
const PORT = 3000;
const HOST = '0.0.0.0'

let db;
const { MongoClient } = require('mongodb');
const collectionName = 'mobileTest'
const { dburl } = require('./dbconfig');
MongoClient.connect( dburl ,(err, client)=>{
	if(err) return console.log(err);
	db = client.db('ehsandb');
	app.listen(PORT, HOST);
	console.log("Server is running");
})