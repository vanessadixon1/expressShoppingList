const express = require('express');
const fs = require('fs');
const item = express.Router();

let jsonData = fs.readFileSync('fakeDb.json', 'utf-8');
let parsedData = JSON.parse(jsonData);


item.get('/item', async(req, res) => {
    res.json(parsedData);
});

item.post('/item', (req, res) => {

    let name = req.query.name;
    let price = req.query.price;

    if(!req.query.name || !req.query.price) {
       return res.send("missing url query");
    }
   
    const newItem = {name: name.toLowerCase(), price: price};

    const foundName = parsedData.find(item => item.name.toLowerCase() === name.toLowerCase());

    if(foundName) {
        return res.status(404).json({error: `item ${name} already exist`})
    }

    parsedData.push(newItem);
    
    fs.writeFile('fakeDb.json', JSON.stringify(parsedData), 'utf-8', (err) => {
        res.json({added: newItem})
    })

})

item.get('/item/:name',  (req, res) => {

    const foundName = parsedData.find(item => item.name === req.params.name);

    if(!foundName) {
        return res.status(404).json({error: `item ${req.params.name} doesn't exist`})
    }

    res.json(foundName);
})

item.patch('/item/:name/:price', (req, res) => {
    const updatePrice = req.params.price.toLowerCase();

    const foundName = parsedData.find(item => item.name === req.params.name);

    if(!foundName) {
        return res.status(404).json({error: `item ${req.params.name} doesn't exist`})
    }

    if(updatePrice === 'y') {
            foundName.price = req.body.price;
            fs.writeFile('fakeDb.json', JSON.stringify(parsedData), (err) =>{
                res.json({updated: foundName});
            } )
        } else if(updatePrice === 'n') {
            foundName.name = req.body.name;
            fs.writeFile('fakeDb.json', JSON.stringify(parsedData), (err) =>{
                res.json({updated: foundName});
            } )
        } else {
            res.json({error: "enter only y or n"})
        }
})

item.delete('/item/:name', (req, res) => {
    const foundName = parsedData.find(item => item.name === req.params.name);
    const foundNameIndex = parsedData.indexOf(foundName);

    parsedData.splice(foundNameIndex, 1);

    fs.writeFileSync('fakeDb.json', JSON.stringify(parsedData), 'utf-8');

    res.json({Deleted : foundName});
})


module.exports = item; 