const express = require('express');
const service = express();
const request = require('superagent');
const APIKEY = ''; // TODO : REPLACE with OWN key 

service.get('/service/:location', (req, res,next) => { 

    var locationurl = 'https://api.openweathermap.org/data/2.5/weather?q='+req.params.location+'&units=metric&appid=' + APIKEY; 
    
     
    request.get(locationurl, (err, locationResponse) => {
        if (err) {
            console.log(err);
            return res.sendStatus(404);
        }
        console.log(locationResponse);
        res.json({result:`${locationResponse.body.main.temp} deg C at ${req.params.location} with ${locationResponse.body.weather[0].description} ` });
    });

     
});

service.get('/service/:lat/:lon',(req, res,next) => { 
    var locationurl = 'https://api.openweathermap.org/data/2.5/weather?lat='+  req.params.lat + '&lon=' + req.params.lat + '&units=metric&appid=' + APIKEY;  
    console.log(` Coordinates : ${req.params.lat}  - ${req.params.lon }` , locationurl);



    //weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}
});

module.exports  = service;

