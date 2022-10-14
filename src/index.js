const express = require('express');
const item = require('./routes/api/items');

const app = express();

app.use(express.json())

app.use('/api', item);
module.exports = app;