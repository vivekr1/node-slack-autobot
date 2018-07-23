const express = require('express');
const service = express();
const request = require('superagent');


service.get('/service', (req, res,next) => { 

    var locationurl = 'https://api.chucknorris.io/jokes/random'; 
    
     
    request.get(locationurl, (err, locationResponse) => {
        if (err) {
            console.log(err);
            return res.sendStatus(404);
        }
        console.log(locationResponse);
        res.json({result:`${locationResponse.body.value}` });
    });
});

module.exports  = service;

