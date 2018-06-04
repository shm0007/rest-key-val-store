const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.raw({extended: true}));
const PORT = 3000;
const HOST = '0.0.0.0'

app.listen(PORT, HOST);
console.log("server is running");