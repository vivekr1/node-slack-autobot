const express = require('express');
const service = express();
const request = require('superagent');
const moment = require('moment');
const APIKEY = ''; // TODO : REPLACE with OWN key 


service.get('/service/:location', (req, res,next) => { 

    var locationurl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+  req.params.location +'&key=' + APIKEY;
     
    request.get(locationurl, (err, locationResponse ) =>{
        if(err) {console.log(err);
            return res.res.sendStatus(500);
        }

        const location =  locationResponse.body.results[0].geometry.location;
        const timestapme = +moment().format('X');


        var  timezoneUrl = 'https://maps.googleapis.com/maps/api/timezone/json?location='+ location.lat +','+location.lng+ '&timestamp=1331161200&key=' + APIKEY;
        request.get(timezoneUrl, (err, timeZoneResponse) =>{
            if(err) {console.log(err);
                return res.res.sendStatus(500);
            }
       
            var result = timeZoneResponse.body;

        const timestring = moment.unix(timestapme + result.dstOffset + result.rawOffset).utc().format('dddd, MMM YYYY  hh:mm:ss a'  );
        console.log(timestring);
            res.json({result: timestring});
        });

       
    });

     
});

module.exports  = service;

